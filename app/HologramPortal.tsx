"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import Link from "next/link";
import TechnologyIcon, { type TechnologyIconKind } from "./TechnologyIcon";

type HologramPortalProps = {
  open: boolean;
  onClose: () => void;
  portraitSrc: string;
};

const modules = [
  {
    key: "python",
    href: "/tecnologias/python",
    icon: "python" as TechnologyIconKind,
    title: "Python",
    subtitle: "Back-end · Automação",
    description:
      "Aplicações Flask, APIs, automações e tratamento de dados com código organizado, testável e reutilizável.",
  },
  {
    key: "django",
    href: "/tecnologias/django",
    icon: "django" as TechnologyIconKind,
    title: "Django",
    subtitle: "ERP · Portais · APIs",
    description:
      "Framework Python completo para aplicações empresariais com ORM, autenticação, administração e integrações por API.",
  },
  {
    key: "power-bi",
    href: "/tecnologias/power-bi",
    icon: "power-bi" as TechnologyIconKind,
    title: "Power BI",
    subtitle: "Dashboards · KPIs",
    description:
      "Modelagem, Power Query, indicadores e painéis executivos que transformam dados operacionais em visão gerencial.",
  },
  {
    key: "sql",
    href: "/tecnologias/sql",
    icon: "sql" as TechnologyIconKind,
    title: "SQL",
    subtitle: "Dados estruturados",
    description:
      "Consultas, organização de bancos relacionais e preparação de informações confiáveis para sistemas e análises.",
  },
  {
    key: "analytics",
    href: "/tecnologias/analise-de-dados",
    icon: "analytics" as TechnologyIconKind,
    title: "Análise de Dados",
    subtitle: "Pandas · Excel · BI",
    description:
      "Validação, exploração e comunicação de dados financeiros, fiscais e operacionais para apoiar decisões melhores.",
  },
] as const;

export default function HologramPortal({ open, onClose, portraitSrc }: HologramPortalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeModule = modules[activeIndex];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function closePortal() {
    dialogRef.current?.close();
  }

  function tiltStage(event: PointerEvent<HTMLDivElement>) {
    const stage = stageRef.current;
    if (!stage || event.pointerType === "touch") return;
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stage.style.setProperty("--holo-tilt-y", `${x * 5}deg`);
    stage.style.setProperty("--holo-tilt-x", `${-y * 3}deg`);
  }

  function resetStage() {
    stageRef.current?.style.setProperty("--holo-tilt-y", "0deg");
    stageRef.current?.style.setProperty("--holo-tilt-x", "0deg");
  }

  function navigateModules(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    const direction = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1;
    const nextIndex = (index + direction + modules.length) % modules.length;
    setActiveIndex(nextIndex);
    const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button");
    buttons?.[nextIndex]?.focus();
  }

  return (
    <dialog
      ref={dialogRef}
      className="hologram-dialog"
      aria-labelledby="hologram-title"
      onClose={onClose}
    >
      <div className="hologram-world">
        <div className="hologram-grid-floor" aria-hidden="true" />
        <div className="hologram-orb hologram-orb-one" aria-hidden="true" />
        <div className="hologram-orb hologram-orb-two" aria-hidden="true" />

        <header className="hologram-bar">
          <div className="hologram-brand"><span>IM</span><b>IGOR.DATA</b></div>
          <p><i /> NÚCLEO ANALÍTICO ONLINE</p>
          <button type="button" onClick={closePortal}>Fechar experiência <span aria-hidden="true">×</span></button>
        </header>

        <div className="hologram-shell">
          <div className="hologram-intro">
            <p>PORTFÓLIO INTERATIVO // DATA EXPERIENCE</p>
            <h2 id="hologram-title">Dados, código e negócio em uma só interface.</h2>
            <span>Explore os módulos e escolha um caminho para continuar no portfólio.</span>
          </div>

          <div className="hologram-command-grid">
            <div
              ref={stageRef}
              className="hologram-character"
              onPointerMove={tiltStage}
              onPointerLeave={resetStage}
            >
              <img src={portraitSrc} alt="Igor Mota em uma interface futurista de Python, Power BI, SQL e análise de dados" />
              <div className="hologram-scan" aria-hidden="true" />
              <div className="hologram-label label-python"><TechnologyIcon kind="python" /><b>Python</b><small>Automação e APIs</small></div>
              <div className="hologram-label label-django"><TechnologyIcon kind="django" /><b>Django</b><small>ERP e portais</small></div>
              <div className="hologram-label label-bi"><TechnologyIcon kind="power-bi" /><b>Power BI</b><small>Dashboards</small></div>
              <div className="hologram-label label-sql"><TechnologyIcon kind="sql" /><b>SQL</b><small>Dados estruturados</small></div>
              <div className="hologram-label label-data"><TechnologyIcon kind="analytics" /><b>Data Analysis</b><small>Insights e decisão</small></div>
              <div className="hologram-platform" aria-hidden="true"><i /><i /><i /></div>
            </div>

            <section className="hologram-console" aria-label="Console de tecnologias">
              <div className="hologram-console-head"><span>TECH CORE / 05 MODULES</span><b>LIVE</b></div>
              <div className="hologram-modules" role="tablist" aria-label="Tecnologias principais">
                {modules.map((module, index) => (
                  <button
                    key={module.key}
                    type="button"
                    role="tab"
                    aria-selected={activeIndex === index}
                    className={activeIndex === index ? "is-active" : ""}
                    onClick={() => { window.location.href = module.href; }}
                    onPointerEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onKeyDown={(event) => navigateModules(event, index)}
                  >
                    <TechnologyIcon kind={module.icon} /><b>{module.title}</b><small>{module.subtitle}</small>
                  </button>
                ))}
              </div>

              <div className="hologram-readout" aria-live="polite">
                <div><span>MÓDULO SELECIONADO</span><strong>{activeModule.title}</strong></div>
                <p>{activeModule.description}</p>
                <Link className="hologram-module-link" href={activeModule.href}>Abrir página de {activeModule.title} <span>↗</span></Link>
                <div className="hologram-signal" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
              </div>

              <nav className="hologram-routes" aria-label="Caminhos do portfólio">
                <p>SELECIONE UM CAMINHO</p>
                <a href="#sobre" onClick={closePortal}><em>01</em><span><b>Perfil</b><small>Formação e propósito</small></span><i>↗</i></a>
                <a href="#habilidades" onClick={closePortal}><em>02</em><span><b>Habilidades</b><small>Competências técnicas</small></span><i>↗</i></a>
                <Link className="is-featured" href="/projetos" onClick={closePortal}><em>03</em><span><b>Projetos</b><small>Produtos e estudos de caso</small></span><i>↗</i></Link>
                <a href="#codigo" onClick={closePortal}><em>04</em><span><b>Código-fonte</b><small>Projeto Flask completo</small></span><i>↗</i></a>
                <a href="#contato" onClick={closePortal}><em>05</em><span><b>Contato</b><small>Iniciar conexão</small></span><i>↗</i></a>
              </nav>
            </section>
          </div>
          <p className="hologram-help">Use mouse, teclado ou toque. O modo de movimento reduzido é respeitado automaticamente.</p>
        </div>
      </div>
    </dialog>
  );
}
