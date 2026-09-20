"use client";

import { useMemo, useState } from "react";
import * as XLSX from "xlsx";

type CellValue = string | number | boolean | Date | null | undefined;
type DataRow = Record<string, CellValue>;

const demoRows: DataRow[] = [
  { Mes: "Jan", Regiao: "Sudeste", Receita: 84200, Custos: 56300, Clientes: 128 },
  { Mes: "Fev", Regiao: "Sudeste", Receita: 91500, Custos: 59200, Clientes: 139 },
  { Mes: "Mar", Regiao: "Sul", Receita: 78800, Custos: 54100, Clientes: 119 },
  { Mes: "Abr", Regiao: "Nordeste", Receita: 97300, Custos: 61700, Clientes: 147 },
  { Mes: "Mai", Regiao: "Sudeste", Receita: 103400, Custos: 64900, Clientes: 156 },
  { Mes: "Jun", Regiao: "Sul", Receita: 99600, Custos: 63800, Clientes: 149 },
  { Mes: "Jul", Regiao: "Centro-Oeste", Receita: 108900, Custos: 68100, Clientes: 163 },
  { Mes: "Ago", Regiao: "Nordeste", Receita: 116400, Custos: 70900, Clientes: 174 },
  { Mes: "Set", Regiao: "Sudeste", Receita: 112800, Custos: 69700, Clientes: 168 },
  { Mes: "Out", Regiao: "Sul", Receita: 121700, Custos: 73500, Clientes: 181 },
  { Mes: "Nov", Regiao: "Centro-Oeste", Receita: 128300, Custos: 76900, Clientes: 192 },
  { Mes: "Dez", Regiao: "Nordeste", Receita: 137600, Custos: 81200, Clientes: 204 },
];

const numberFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

function toNumber(value: CellValue): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const clean = value.trim().replace(/R\$|\s/g, "");
  if (!clean || /[A-Za-z]/.test(clean)) return null;
  const normalized = clean.includes(",")
    ? clean.replace(/\./g, "").replace(",", ".")
    : clean;
  const parsed = Number(normalized.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function quantile(values: number[], percentile: number) {
  const sorted = [...values].sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const position = (sorted.length - 1) * percentile;
  const base = Math.floor(position);
  const rest = position - base;
  return sorted[base + 1] === undefined ? sorted[base] : sorted[base] + rest * (sorted[base + 1] - sorted[base]);
}

function normalizeRows(input: DataRow[]) {
  return input.slice(0, 10000).map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [key.trim() || "Coluna", value instanceof Date ? value.toLocaleDateString("pt-BR") : value]),
    ),
  );
}

export default function DataLab() {
  const [rows, setRows] = useState<DataRow[]>(demoRows);
  const [sourceName, setSourceName] = useState("Dados de demonstração");
  const [metric, setMetric] = useState("Receita");
  const [category, setCategory] = useState("Regiao");
  const [message, setMessage] = useState("Dashboard de demonstração pronto para explorar.");
  const [error, setError] = useState("");

  const columns = useMemo(() => Array.from(new Set(rows.flatMap((row) => Object.keys(row)))), [rows]);
  const numericColumns = useMemo(
    () => columns.filter((column) => {
      const present = rows.map((row) => row[column]).filter((value) => value !== null && value !== undefined && value !== "");
      return present.length > 0 && present.filter((value) => toNumber(value) !== null).length / present.length >= 0.6;
    }),
    [columns, rows],
  );
  const categoryColumns = useMemo(() => columns.filter((column) => !numericColumns.includes(column)), [columns, numericColumns]);

  const activeMetric = numericColumns.includes(metric) ? metric : numericColumns[0] || "";
  const activeCategory = columns.includes(category) ? category : categoryColumns[0] || columns[0] || "";

  const analysis = useMemo(() => {
    const values = rows.map((row, index) => ({ index, value: toNumber(row[activeMetric]) })).filter((item): item is { index: number; value: number } => item.value !== null);
    const numbers = values.map((item) => item.value);
    const sum = numbers.reduce((total, value) => total + value, 0);
    const average = numbers.length ? sum / numbers.length : 0;
    const min = numbers.length ? Math.min(...numbers) : 0;
    const max = numbers.length ? Math.max(...numbers) : 0;
    const med = median(numbers);
    const deviation = numbers.length ? Math.sqrt(numbers.reduce((total, value) => total + (value - average) ** 2, 0) / numbers.length) : 0;
    const missing = rows.reduce((total, row) => total + columns.filter((column) => row[column] === null || row[column] === undefined || row[column] === "").length, 0);
    const missingRate = rows.length && columns.length ? (missing / (rows.length * columns.length)) * 100 : 0;

    const groups = new Map<string, { sum: number; count: number }>();
    rows.forEach((row) => {
      const label = String(row[activeCategory] ?? "Sem categoria");
      const value = toNumber(row[activeMetric]);
      if (value === null) return;
      const current = groups.get(label) || { sum: 0, count: 0 };
      groups.set(label, { sum: current.sum + value, count: current.count + 1 });
    });
    const groupList = [...groups.entries()].map(([label, value]) => ({ label, ...value })).sort((a, b) => b.sum - a.sum).slice(0, 6);

    const q1 = quantile(numbers, 0.25);
    const q3 = quantile(numbers, 0.75);
    const iqr = q3 - q1;
    const outliers = numbers.filter((value) => value < q1 - 1.5 * iqr || value > q3 + 1.5 * iqr).length;

    const n = values.length;
    const sumX = values.reduce((total, item) => total + item.index, 0);
    const sumY = sum;
    const sumXY = values.reduce((total, item) => total + item.index * item.value, 0);
    const sumXX = values.reduce((total, item) => total + item.index ** 2, 0);
    const denominator = n * sumXX - sumX ** 2;
    const slope = denominator && n > 1 ? (n * sumXY - sumX * sumY) / denominator : 0;
    const intercept = n ? (sumY - slope * sumX) / n : 0;
    const forecast = n ? intercept + slope * (values[values.length - 1]?.index + 1) : 0;
    const totalVariation = numbers.reduce((total, value) => total + (value - average) ** 2, 0);
    const residualVariation = values.reduce((total, item) => total + (item.value - (intercept + slope * item.index)) ** 2, 0);
    const r2 = totalVariation ? Math.max(0, 1 - residualVariation / totalVariation) : 0;
    const trendPercent = average ? (slope / Math.abs(average)) * 100 : 0;

    const chartMin = min;
    const chartMax = max;
    const range = chartMax - chartMin || 1;
    const linePoints = values.map((item, index) => ({
      x: values.length === 1 ? 300 : (index / (values.length - 1)) * 580 + 10,
      y: 200 - ((item.value - chartMin) / range) * 170,
    }));
    const path = linePoints.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
    const concentration = sum && groupList[0] ? Math.abs((groupList[0].sum / sum) * 100) : 0;

    return { numbers, sum, average, min, max, med, deviation, missingRate, groupList, outliers, slope, forecast, r2, trendPercent, path, concentration };
  }, [activeCategory, activeMetric, columns, rows]);

  async function handleFile(file?: File) {
    if (!file) return;
    setError("");
    if (file.size > 8 * 1024 * 1024) {
      setError("O arquivo ultrapassa 8 MB. Use uma amostra menor para manter a análise rápida.");
      return;
    }
    try {
      setMessage("Lendo a planilha no seu navegador…");
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsed = normalizeRows(XLSX.utils.sheet_to_json<DataRow>(sheet, { defval: null, raw: true }));
      if (!parsed.length) throw new Error("A primeira aba não possui linhas de dados.");
      const parsedColumns = Array.from(new Set(parsed.flatMap((row) => Object.keys(row))));
      const parsedNumeric = parsedColumns.filter((column) => parsed.some((row) => toNumber(row[column]) !== null));
      setRows(parsed);
      setSourceName(file.name);
      setMetric(parsedNumeric[0] || "");
      setCategory(parsedColumns.find((column) => !parsedNumeric.includes(column)) || parsedColumns[0] || "");
      setMessage(`${numberFormatter.format(parsed.length)} linhas analisadas localmente. Nenhum dado foi enviado ao servidor.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível interpretar o arquivo.");
      setMessage("Escolha outro arquivo ou restaure os dados de demonstração.");
    }
  }

  function restoreDemo() {
    setRows(demoRows);
    setSourceName("Dados de demonstração");
    setMetric("Receita");
    setCategory("Regiao");
    setError("");
    setMessage("Dashboard de demonstração restaurado.");
  }

  const maxGroup = Math.max(...analysis.groupList.map((item) => Math.abs(item.sum)), 1);
  const trendLabel = analysis.trendPercent > 0.05 ? "crescimento" : analysis.trendPercent < -0.05 ? "queda" : "estabilidade";

  return (
    <section className="data-lab" id="laboratorio" aria-labelledby="data-lab-title">
      <div className="data-lab-intro">
        <div><p>LABORATÓRIO INTERATIVO</p><h2 id="data-lab-title">Transforme uma planilha em decisões visuais.</h2></div>
        <p>Importe CSV, XLS ou XLSX. A demonstração identifica campos numéricos, calcula indicadores e explica quatro níveis de análise.</p>
      </div>

      <div className="data-upload-panel">
        <div><span>FONTE ATUAL</span><strong>{sourceName}</strong><small>Primeira aba · limite de 10.000 linhas e 8 MB</small></div>
        <label className="data-file-button">Importar planilha<input type="file" accept=".csv,.xls,.xlsx,text/csv" onChange={(event) => void handleFile(event.target.files?.[0])} /></label>
        <button type="button" onClick={restoreDemo}>Usar demonstração</button>
      </div>
      <p className="data-privacy">🔒 Processamento local: seus dados permanecem no navegador e não são armazenados pelo portfólio.</p>
      <p className="data-status" aria-live="polite">{error ? <span>{error}</span> : message}</p>

      <div className="data-controls">
        <label>Métrica numérica<select value={activeMetric} onChange={(event) => setMetric(event.target.value)}>{numericColumns.map((column) => <option key={column}>{column}</option>)}</select></label>
        <label>Dimensão para comparar<select value={activeCategory} onChange={(event) => setCategory(event.target.value)}>{columns.map((column) => <option key={column}>{column}</option>)}</select></label>
      </div>

      {activeMetric ? (
        <>
          <div className="data-kpis">
            <article><span>LINHAS</span><strong>{numberFormatter.format(rows.length)}</strong><small>{columns.length} colunas encontradas</small></article>
            <article><span>TOTAL · {activeMetric}</span><strong>{numberFormatter.format(analysis.sum)}</strong><small>Média {numberFormatter.format(analysis.average)}</small></article>
            <article><span>QUALIDADE</span><strong>{numberFormatter.format(100 - analysis.missingRate)}%</strong><small>Dados preenchidos</small></article>
            <article><span>TENDÊNCIA</span><strong className={analysis.slope >= 0 ? "positive" : "negative"}>{analysis.slope >= 0 ? "+" : ""}{numberFormatter.format(analysis.trendPercent)}%</strong><small>Variação média por registro</small></article>
          </div>

          <div className="data-visuals">
            <article className="data-chart-card">
              <header><div><span>EVOLUÇÃO</span><h3>{activeMetric} por registro</h3></div><b>{trendLabel}</b></header>
              <svg viewBox="0 0 600 220" role="img" aria-label={`Linha de evolução de ${activeMetric}`}>
                <defs><linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#60dfff" stopOpacity=".32"/><stop offset="1" stopColor="#60dfff" stopOpacity="0"/></linearGradient></defs>
                <path className="data-area" d={`${analysis.path} L590,210 L10,210 Z`} />
                <path className="data-line" d={analysis.path} />
              </svg>
              <div className="chart-scale"><span>Mín. {numberFormatter.format(analysis.min)}</span><span>Máx. {numberFormatter.format(analysis.max)}</span></div>
            </article>

            <article className="data-chart-card">
              <header><div><span>COMPARAÇÃO</span><h3>{activeMetric} por {activeCategory}</h3></div><b>top {analysis.groupList.length}</b></header>
              <div className="category-bars">{analysis.groupList.map((item) => <div key={item.label}><p><span>{item.label}</span><b>{numberFormatter.format(item.sum)}</b></p><i><span style={{ width: `${Math.max(4, Math.abs(item.sum) / maxGroup * 100)}%` }} /></i></div>)}</div>
            </article>
          </div>

          <div className="analysis-levels">
            <article><span>01 · DESCRITIVA</span><h3>O que aconteceu?</h3><p>Resume os dados atuais: total de <b>{numberFormatter.format(analysis.sum)}</b>, média de <b>{numberFormatter.format(analysis.average)}</b> e mediana de <b>{numberFormatter.format(analysis.med)}</b>.</p><small>Totais, médias, distribuição e indicadores.</small></article>
            <article><span>02 · DIAGNÓSTICA</span><h3>Onde investigar?</h3><p><b>{analysis.groupList[0]?.label || "Sem categoria"}</b> lidera a comparação. Foram sinalizados <b>{analysis.outliers}</b> possíveis valores fora do padrão.</p><small>Segmentação e anomalias indicam hipóteses — não provam causa.</small></article>
            <article><span>03 · PREDITIVA</span><h3>O que pode acontecer?</h3><p>A tendência linear estima o próximo valor em <b>{numberFormatter.format(analysis.forecast)}</b>, com aderência R² de <b>{numberFormatter.format(analysis.r2 * 100)}%</b>.</p><small>Estimativa educacional; previsão real exige validação e contexto.</small></article>
            <article><span>04 · PRESCRITIVA</span><h3>Qual ação considerar?</h3><p>{analysis.missingRate > 5 ? "Priorizar o tratamento de campos vazios antes de decidir." : analysis.concentration > 45 ? `Investigar dependência de ${analysis.groupList[0]?.label} e diversificar o resultado.` : analysis.slope < 0 ? "Revisar os períodos de queda e testar ações corretivas mensuráveis." : "Preservar os fatores de crescimento e acompanhar metas por segmento."}</p><small>Recomendação orientativa, nunca uma decisão automática.</small></article>
          </div>

          <div className="data-preview"><header><div><span>AMOSTRA DOS DADOS</span><h3>Primeiras linhas processadas</h3></div><small>{Math.min(rows.length, 8)} de {rows.length} linhas</small></header><div><table><thead><tr>{columns.slice(0, 8).map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.slice(0, 8).map((row, index) => <tr key={index}>{columns.slice(0, 8).map((column) => <td key={column}>{String(row[column] ?? "—")}</td>)}</tr>)}</tbody></table></div></div>
        </>
      ) : <div className="data-empty">A planilha precisa ter ao menos uma coluna numérica para gerar as métricas.</div>}
    </section>
  );
}
