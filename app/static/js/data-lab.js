(() => {
  "use strict";

  const demoRows = [
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

  const format = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector("[data-data-lab]");
    if (!root) return;

    const state = { rows: demoRows, sourceName: "Dados de demonstração", metric: "Receita", category: "Regiao" };
    const element = (selector) => root.querySelector(selector);

    element("[data-file-input]")?.addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      await readFile(file);
    });

    element("[data-demo-reset]")?.addEventListener("click", () => {
      state.rows = demoRows;
      state.sourceName = "Dados de demonstração";
      state.metric = "Receita";
      state.category = "Regiao";
      setStatus("Dashboard de demonstração restaurado.", false);
      render();
    });

    element("[data-metric-select]")?.addEventListener("change", (event) => {
      state.metric = event.target.value;
      render(false);
    });

    element("[data-category-select]")?.addEventListener("change", (event) => {
      state.category = event.target.value;
      render(false);
    });

    async function readFile(file) {
      if (file.size > 8 * 1024 * 1024) {
        setStatus("O arquivo ultrapassa 8 MB. Use uma amostra menor.", true);
        return;
      }
      if (!window.XLSX) {
        setStatus("O leitor de planilhas não foi carregado. Atualize a página.", true);
        return;
      }

      try {
        setStatus("Lendo a planilha no seu navegador…", false);
        const workbook = window.XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const parsed = window.XLSX.utils.sheet_to_json(sheet, { defval: null, raw: true })
          .slice(0, 10000)
          .map((row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [
            String(key).trim() || "Coluna",
            value instanceof Date ? value.toLocaleDateString("pt-BR") : value,
          ])));

        if (!parsed.length) throw new Error("A primeira aba não possui linhas de dados.");
        state.rows = parsed;
        state.sourceName = file.name;

        const metadata = getMetadata();
        state.metric = metadata.numeric[0] || "";
        state.category = metadata.columns.find((column) => !metadata.numeric.includes(column)) || metadata.columns[0] || "";
        setStatus(format.format(parsed.length) + " linhas analisadas localmente. Nenhum dado foi enviado ao servidor.", false);
        render();
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Não foi possível interpretar o arquivo.", true);
      }
    }

    function setStatus(message, isError) {
      const status = element("[data-data-status]");
      if (!status) return;
      status.textContent = message;
      status.classList.toggle("is-error", isError);
    }

    function toNumber(value) {
      if (typeof value === "number" && Number.isFinite(value)) return value;
      if (typeof value !== "string") return null;
      const clean = value.trim().replace(/R\$|\s/g, "");
      if (!clean || /[A-Za-z]/.test(clean)) return null;
      const normalized = clean.includes(",") ? clean.replace(/\./g, "").replace(",", ".") : clean;
      const parsed = Number(normalized.replace(/[^0-9.-]/g, ""));
      return Number.isFinite(parsed) ? parsed : null;
    }

    function getMetadata() {
      const columns = [...new Set(state.rows.flatMap((row) => Object.keys(row)))];
      const numeric = columns.filter((column) => {
        const present = state.rows.map((row) => row[column]).filter((value) => value !== null && value !== undefined && value !== "");
        return present.length && present.filter((value) => toNumber(value) !== null).length / present.length >= 0.6;
      });
      return { columns, numeric };
    }

    function median(values) {
      const sorted = [...values].sort((a, b) => a - b);
      if (!sorted.length) return 0;
      const middle = Math.floor(sorted.length / 2);
      return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
    }

    function quantile(values, percentile) {
      const sorted = [...values].sort((a, b) => a - b);
      if (!sorted.length) return 0;
      const position = (sorted.length - 1) * percentile;
      const base = Math.floor(position);
      const rest = position - base;
      return sorted[base + 1] === undefined ? sorted[base] : sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    }

    function analyze(columns) {
      const values = state.rows
        .map((row, index) => ({ index, value: toNumber(row[state.metric]) }))
        .filter((item) => item.value !== null);
      const numbers = values.map((item) => item.value);
      const sum = numbers.reduce((total, value) => total + value, 0);
      const average = numbers.length ? sum / numbers.length : 0;
      const min = numbers.length ? Math.min(...numbers) : 0;
      const max = numbers.length ? Math.max(...numbers) : 0;
      const med = median(numbers);
      const missing = state.rows.reduce((total, row) => total + columns.filter((column) => row[column] === null || row[column] === undefined || row[column] === "").length, 0);
      const missingRate = state.rows.length && columns.length ? missing / (state.rows.length * columns.length) * 100 : 0;

      const groups = new Map();
      state.rows.forEach((row) => {
        const label = String(row[state.category] ?? "Sem categoria");
        const value = toNumber(row[state.metric]);
        if (value === null) return;
        const current = groups.get(label) || { sum: 0, count: 0 };
        groups.set(label, { sum: current.sum + value, count: current.count + 1 });
      });
      const groupList = [...groups.entries()]
        .map(([label, value]) => ({ label, ...value }))
        .sort((a, b) => b.sum - a.sum)
        .slice(0, 6);

      const q1 = quantile(numbers, 0.25);
      const q3 = quantile(numbers, 0.75);
      const iqr = q3 - q1;
      const outliers = numbers.filter((value) => value < q1 - 1.5 * iqr || value > q3 + 1.5 * iqr).length;

      const n = values.length;
      const sumX = values.reduce((total, item) => total + item.index, 0);
      const sumXY = values.reduce((total, item) => total + item.index * item.value, 0);
      const sumXX = values.reduce((total, item) => total + item.index ** 2, 0);
      const denominator = n * sumXX - sumX ** 2;
      const slope = denominator && n > 1 ? (n * sumXY - sumX * sum) / denominator : 0;
      const intercept = n ? (sum - slope * sumX) / n : 0;
      const lastIndex = values.length ? values[values.length - 1].index : 0;
      const forecast = n ? intercept + slope * (lastIndex + 1) : 0;
      const totalVariation = numbers.reduce((total, value) => total + (value - average) ** 2, 0);
      const residualVariation = values.reduce((total, item) => total + (item.value - (intercept + slope * item.index)) ** 2, 0);
      const r2 = totalVariation ? Math.max(0, 1 - residualVariation / totalVariation) : 0;
      const trendPercent = average ? slope / Math.abs(average) * 100 : 0;

      const range = max - min || 1;
      const points = values.map((item, index) => ({
        x: values.length === 1 ? 300 : index / (values.length - 1) * 580 + 10,
        y: 200 - (item.value - min) / range * 170,
      }));
      const path = points.map((point, index) => (index ? "L" : "M") + point.x.toFixed(1) + "," + point.y.toFixed(1)).join(" ");
      const concentration = sum && groupList[0] ? Math.abs(groupList[0].sum / sum * 100) : 0;

      return { sum, average, min, max, med, missingRate, groupList, outliers, slope, forecast, r2, trendPercent, path, concentration };
    }

    function populateSelect(select, options, selected) {
      if (!(select instanceof HTMLSelectElement)) return;
      select.replaceChildren();
      options.forEach((optionValue) => {
        const option = document.createElement("option");
        option.value = optionValue;
        option.textContent = optionValue;
        option.selected = optionValue === selected;
        select.append(option);
      });
    }

    function render(rebuildControls = true) {
      const metadata = getMetadata();
      if (!metadata.numeric.includes(state.metric)) state.metric = metadata.numeric[0] || "";
      if (!metadata.columns.includes(state.category)) state.category = metadata.columns.find((column) => !metadata.numeric.includes(column)) || metadata.columns[0] || "";

      element("[data-source-name]").textContent = state.sourceName;
      element("[data-dashboard]").hidden = !state.metric;
      element("[data-data-empty]").hidden = Boolean(state.metric);
      if (!state.metric) return;

      if (rebuildControls) {
        populateSelect(element("[data-metric-select]"), metadata.numeric, state.metric);
        populateSelect(element("[data-category-select]"), metadata.columns, state.category);
      }

      const analysis = analyze(metadata.columns);
      const trendLabel = analysis.trendPercent > 0.05 ? "crescimento" : analysis.trendPercent < -0.05 ? "queda" : "estabilidade";

      element("[data-kpi-rows]").textContent = format.format(state.rows.length);
      element("[data-kpi-columns]").textContent = metadata.columns.length + " colunas encontradas";
      element("[data-kpi-total-label]").textContent = "TOTAL · " + state.metric;
      element("[data-kpi-total]").textContent = format.format(analysis.sum);
      element("[data-kpi-average]").textContent = "Média " + format.format(analysis.average);
      element("[data-kpi-quality]").textContent = format.format(100 - analysis.missingRate) + "%";
      const trend = element("[data-kpi-trend]");
      trend.textContent = (analysis.slope >= 0 ? "+" : "") + format.format(analysis.trendPercent) + "%";
      trend.className = analysis.slope >= 0 ? "positive" : "negative";

      element("[data-line-title]").textContent = state.metric + " por registro";
      element("[data-trend-label]").textContent = trendLabel;
      element("[data-chart-line]").setAttribute("d", analysis.path);
      element("[data-chart-area]").setAttribute("d", analysis.path ? analysis.path + " L590,210 L10,210 Z" : "");
      element("[data-chart-min]").textContent = "Mín. " + format.format(analysis.min);
      element("[data-chart-max]").textContent = "Máx. " + format.format(analysis.max);

      element("[data-group-title]").textContent = state.metric + " por " + state.category;
      element("[data-group-count]").textContent = "top " + analysis.groupList.length;
      const bars = element("[data-category-bars]");
      bars.replaceChildren();
      const maxGroup = Math.max(1, ...analysis.groupList.map((item) => Math.abs(item.sum)));
      analysis.groupList.forEach((item) => {
        const row = document.createElement("div");
        const header = document.createElement("p");
        const label = document.createElement("span");
        const value = document.createElement("b");
        label.textContent = item.label;
        value.textContent = format.format(item.sum);
        header.append(label, value);
        const track = document.createElement("i");
        const fill = document.createElement("span");
        fill.style.width = String(Math.max(4, Math.abs(item.sum) / maxGroup * 100)) + "%";
        track.append(fill);
        row.append(header, track);
        bars.append(row);
      });

      element("[data-analysis-descriptive]").textContent = "Total de " + format.format(analysis.sum) + ", média de " + format.format(analysis.average) + " e mediana de " + format.format(analysis.med) + ".";
      element("[data-analysis-diagnostic]").textContent = (analysis.groupList[0]?.label || "Sem categoria") + " lidera a comparação. Foram sinalizados " + analysis.outliers + " possíveis valores fora do padrão.";
      element("[data-analysis-predictive]").textContent = "A tendência linear estima o próximo valor em " + format.format(analysis.forecast) + ", com aderência R² de " + format.format(analysis.r2 * 100) + "%.";
      element("[data-analysis-prescriptive]").textContent =
        analysis.missingRate > 5 ? "Priorizar o tratamento de campos vazios antes de decidir." :
        analysis.concentration > 45 ? "Investigar a concentração no principal grupo e diversificar o resultado." :
        analysis.slope < 0 ? "Revisar os períodos de queda e testar ações corretivas mensuráveis." :
        "Preservar os fatores de crescimento e acompanhar metas por segmento.";

      renderTable(metadata.columns);
    }

    function renderTable(columns) {
      const visibleColumns = columns.slice(0, 8);
      const head = element("[data-table-head]");
      const body = element("[data-table-body]");
      head.replaceChildren();
      body.replaceChildren();

      const headerRow = document.createElement("tr");
      visibleColumns.forEach((column) => {
        const cell = document.createElement("th");
        cell.textContent = column;
        headerRow.append(cell);
      });
      head.append(headerRow);

      state.rows.slice(0, 8).forEach((row) => {
        const tableRow = document.createElement("tr");
        visibleColumns.forEach((column) => {
          const cell = document.createElement("td");
          cell.textContent = row[column] === null || row[column] === undefined || row[column] === "" ? "—" : String(row[column]);
          tableRow.append(cell);
        });
        body.append(tableRow);
      });
      element("[data-preview-count]").textContent = Math.min(state.rows.length, 8) + " de " + state.rows.length + " linhas";
    }

    render();
  });
})();
