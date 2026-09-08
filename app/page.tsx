"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import rawData from "@/data/cases.json";

import { CatalogueFilters, areaOptions } from "./catalogue-filters";
import {
  audienceOptions, coreOptions, corporateAreaOptions, defaultFilters, filterCases,
  labelFor, maturityType, preparationOptions, taskOptions, updateFilters,
  type AreaKey, type CaseItem, type Filters,
} from "@/lib/catalogue";

const cases = rawData.cases as CaseItem[];
const PAGE_SIZE = 24;

const compact = (value: string, max = 236) =>
  value.length > max ? `${value.slice(0, max).trimEnd()}…` : value;

const levelShort = (level: string) => level.split(" · ")[0];

function BrandHeader() {
  return (
    <header className="site-header">
      <a className="brand-client" href="#inicio" aria-label="Ir al inicio">
        <img src="/brand/deloitte-logo.png" alt="Deloitte" />
      </a>
      <nav className="main-nav" aria-label="Navegación principal">
        <a href="#arquitectura">Arquitectura</a>
        <a href="#banco">Banco de casos</a>
      </nav>

    </header>
  );
}

function FlowChart({ item }: { item: CaseItem }) {
  const steps = [
    {
      number: "01",
      label: "Contexto",
      text: item.profiles,
    },
    {
      number: "02",
      label: "Copilot",
      text: item.primary,
    },
    {
      number: "03",
      label: "Resultado",
      text: item.deliverable,
    },
    {
      number: "04",
      label: "Control",
      text: item.humanReview,
    },
  ];

  return (
    <div className="flow" aria-label="Flujo orientativo del caso">
      {steps.map((step) => (
        <div className="flow-step" key={step.number}>
          <span className="flow-number">{step.number}</span>
          <div>
            <span className="flow-label">{step.label}</span>
            <p>{step.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CaseModal({
  item,
  position,
  total,
  onClose,
  onPrevious,
  onNext,
}: {
  item: CaseItem;
  position: number;
  total: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrevious();
      if (event.key === "ArrowRight") onNext();
    };
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", onKeyDown);
    closeButton.current?.focus();
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, onNext, onPrevious]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="case-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-topbar">
          <span>
            Caso {position + 1} de {total}
          </span>
          <button
            className="close-button"
            onClick={onClose}
            ref={closeButton}
            aria-label="Cerrar ficha"
          >
            Cerrar
          </button>
        </div>

        <div className="modal-heading">
          <div className="case-eyebrow">
            <span className="case-id">{item.id}</span>
            <span>{item.block}</span>
          </div>
          <h2 id="case-modal-title">{item.title}</h2>
          <p className="modal-description">{item.description}</p>
        </div>

        <div className="modal-tags" aria-label="Clasificación del caso">
          <span>{item.coverage}</span>
          <span>{item.route}</span>
          <span>{item.level}</span>
          <span className={maturityType(item.maturity) === "Preview" ? "tag-preview" : ""}>
            {item.maturity}
          </span>
        </div>

        <section className="case-classification" aria-label="Aplicación y preparación">
          <dl>
            <div><dt>Tareas</dt><dd>{item.tasks.map(v => labelFor(taskOptions, v)).join(" · ")}</dd></div>
            <div><dt>Herramientas y capacidades</dt><dd>{item.tools.join(" · ")}</dd></div>
            <div><dt>Perfiles que suelen ejecutar el caso</dt><dd>{item.audiences.map(v => labelFor(audienceOptions, v)).join(" · ")}</dd></div>
            {item.corporateAreas.length > 0 && <div><dt>Aplicación en Corporativas</dt><dd>{item.corporateAreas.map(v => labelFor(corporateAreaOptions, v)).join(" · ")}</dd></div>}
            <div><dt>Preparación necesaria</dt><dd>{item.preparation.map(v => labelFor(preparationOptions, v)).join(" · ")}</dd></div>
            <div><dt>Relación con el troncal</dt><dd><strong>{labelFor(coreOptions, item.coreRelation)}</strong><p>{item.coreRationale}</p>{item.coreLessons.length > 0 && <small>Referencias del troncal: {item.coreLessons.join(" · ")}</small>}</dd></div>
          </dl>
        </section>
        {item.input && <section className="modal-section practice-detail">
          <div className="section-heading"><span className="section-kicker">Práctica propuesta</span><h3>Del material de entrada al resultado</h3></div>
          <h4>Qué necesitas</h4><p>{item.input}</p>
          <h4>Cómo trabajarlo</h4><ol>{item.steps?.map(step => <li key={step}>{step}</li>)}</ol>
          <h4>Prompt de partida</h4><blockquote>{item.examplePrompt}</blockquote>
          <p><strong>Resultado esperado:</strong> {item.deliverable}</p>
        </section>}

        <section className="modal-section flow-section">
          <div className="section-heading">
            <span className="section-kicker">Flujo orientativo</span>
            <h3>Cómo se convierte el trabajo en un resultado revisable</h3>
          </div>
          <FlowChart item={item} />
        </section>

        <div className="detail-grid">
          <section className="detail-panel">
            <span className="section-kicker">Diseño del caso</span>
            <dl>
              <div>
                <dt>Familia de trabajo</dt>
                <dd>{item.family}</dd>
              </div>
              <div>
                <dt>Funcionalidades implicadas</dt>
                <dd>{item.involved}</dd>
              </div>
              <div>
                <dt>Condiciones</dt>
                <dd>{item.conditions}</dd>
              </div>
            </dl>
          </section>

          <section className="detail-panel audit-panel">
            <span className="section-kicker">Viabilidad y revisión</span>
            <p>{item.auditFinding}</p>
            <p className="source-date">{item.addedOn ? "Propuesta añadida el 08/09/2026. Comprobar la disponibilidad en el entorno antes de impartirla." : "Nota funcional del catálogo de 31/07/2026. Clasificación revisada el 08/09/2026; verificar disponibilidad actual antes de impartirlo."}</p>
            <p className="status-line">
              <strong>Cartera:</strong> {item.status}
            </p>
          </section>
        </div>

        <section className="modal-section">
          <div className="section-heading compact-heading">
            <span className="section-kicker">Aplicabilidad Deloitte</span>
            <h3>Directa, adaptable o fuera de alcance</h3>
          </div>
          <div className="area-matrix">
            {areaOptions.slice(1).map((area) => {
              const mark = item.areas[area.key as AreaKey];
              return (
                <div className={mark ? "area-cell is-active" : "area-cell"} key={area.key}>
                  <strong>{area.short}</strong>
                  <span>
                    {mark === "●"
                      ? "Aplicación directa"
                      : mark === "○"
                        ? "Con adaptación"
                        : "No prioritaria"}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <div className="modal-footer">
          <div className="source-links">
            <span>Fuentes oficiales</span>
            <a href={item.microsoftSource} target="_blank" rel="noreferrer">
              Microsoft ↗
            </a>
            {item.deloitteSource && <a href={item.deloitteSource} target="_blank" rel="noreferrer">
              Deloitte ↗
            </a>}
          </div>
          <div className="modal-navigation">
            <button onClick={onPrevious} disabled={position === 0}>
              ← Anterior
            </button>
            <button onClick={onNext} disabled={position === total - 1}>
              Siguiente →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const filtered = useMemo(() => filterCases(cases, filters), [filters]);
  const selectedIndex = selectedId ? filtered.findIndex(item => item.id === selectedId) : -1;
  const selected = selectedIndex >= 0 ? filtered[selectedIndex] : null;
  const changeFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters(current => updateFilters(current, key, value));
    setVisible(PAGE_SIZE);
    setSelectedId(null);
  };
  const resetFilters = () => {
    setFilters(defaultFilters);
    setVisible(PAGE_SIZE);
    setSelectedId(null);
  };
  const chooseArea = (key: AreaKey) => {
    changeFilter("area", key);
    document.getElementById("banco")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <BrandHeader />
      <main>
        <section className="hero" id="inicio">
          <div className="hero-content">
            <span className="kicker">Adopción de Microsoft 365 Copilot</span>
            <h1>
              Un banco de casos para <span>elegir mejor.</span>
            </h1>
            <p className="hero-lead">
              {cases.length} casos de uso para diseñar itinerarios comunes,
              específicos y especialistas en Deloitte.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#banco">
                Explorar los casos
              </a>
              <a className="text-link" href="#arquitectura">
                Ver criterio de diseño →
              </a>
            </div>
          </div>

          <aside className="hero-summary" aria-label="Resumen del banco">
            <span className="summary-label">Catálogo actualizado · 08/09/2026</span>
            <strong>{cases.length}</strong>
            <span className="summary-title">casos navegables</span>
            <span className="summary-new">{cases.filter(item => item.addedOn).length} nuevos casos comunes a Corporativas</span>
          </aside>
        </section>

        <section className="catalogue" id="banco">
          <div className="catalogue-heading">
            <div>
              <span className="kicker">Banco de casos</span>
              <h2>Encuentra la opción adecuada</h2>
            </div>
            <p>
              Busca por tarea, perfil o funcionalidad. Combina filtros para
              seleccionar ejemplos aplicables al trabajo de cada equipo.
            </p>
          </div>

          <CatalogueFilters items={cases} filters={filters} onChange={changeFilter} onReset={resetFilters} total={filtered.length} />

          {filtered.length > 0 ? (
            <>
              <div className="case-grid">
                {filtered.slice(0, visible).map((item) => {
                  const selectedAreaMark =
                    filters.area === "all" ? "" : item.areas[filters.area];
                  return (
                    <article className="case-card" key={item.id}>
                      <div className="card-topline">
                        <span className="case-id">{item.id}</span>
                        <span className="card-block">{item.addedOn ? "Nuevo · Corporativas" : item.block}</span>
                      </div>
                      <div className="card-content">
                        <p className="card-family">{item.family}</p>
                        <h3>{item.title}</h3>
                        <p className="card-description">{compact(item.description)}</p>
                      </div>
                      <div className="card-tags">
                        {item.corporateAreas.includes("common") && <span>Común a Corporativas</span>}
                        <span>{item.coverage}</span>
                        <span>{levelShort(item.level)}</span>
                        {selectedAreaMark && (
                          <span className="area-fit">
                            {selectedAreaMark === "●" ? "Aplicación directa" : "Con adaptación"}
                          </span>
                        )}
                      </div>
                      <div className="card-footer">
                        <div>
                          <span>Capacidad principal</span>
                          <strong>{item.primary}</strong>
                        </div>
                        <button
                          onClick={() => setSelectedId(item.id)}
                          aria-label={`Abrir ficha de ${item.title}`}
                        >
                          Ver ficha y flujo →
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {visible < filtered.length && (
                <div className="load-more">
                  <button onClick={() => setVisible((current) => current + PAGE_SIZE)}>
                    Mostrar {Math.min(PAGE_SIZE, filtered.length - visible)} casos más
                  </button>
                  <span>
                    Mostrando {Math.min(visible, filtered.length)} de {filtered.length}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <span>0</span>
              <h3>No hay casos con esta combinación.</h3>
              <p>Prueba a ampliar la cobertura o limpiar alguno de los filtros.</p>
              <button onClick={resetFilters}>Limpiar todos los filtros</button>
            </div>
          )}
        </section>
        <section className="architecture" id="arquitectura">
          <div className="section-intro">
            <span className="kicker">Arquitectura recomendada</span>
            <h2>Universal donde aporta. Especialista donde importa.</h2>
            <p>
              El catálogo permite seleccionar un tronco
              común y añadir laboratorios por subárea sin diluir el valor
              profesional del itinerario.
            </p>
          </div>

          <div className="architecture-grid">
            <article>
              <span className="architecture-number">01</span>
              <h3>Tronco transversal</h3>
              <p>
                Reuniones, búsqueda, análisis, documentos y uso seguro para
                todos los perfiles.
              </p>
            </article>
            <article>
              <span className="architecture-number">02</span>
              <h3>Núcleo de negocio</h3>
              <p>
                Patrones reconocibles por la mayoría de cada línea, con ejemplos
                propios y fuentes autorizadas.
              </p>
            </article>
            <article>
              <span className="architecture-number">03</span>
              <h3>Laboratorios especialistas</h3>
              <p>
                Casos fiscales, legales, técnicos, de riesgo o personas donde
                contexto y validación son imprescindibles.
              </p>
            </article>
          </div>

          <div className="area-selector" aria-label="Accesos por área">
            {areaOptions.slice(1).map((option) => {
              const applicable = cases.filter(
                (item) => Boolean(item.areas[option.key as AreaKey]),
              );
              const direct = applicable.filter(
                (item) => item.areas[option.key as AreaKey] === "●",
              ).length;
              return (
                <button key={option.key} onClick={() => chooseArea(option.key as AreaKey)}>
                  <span>{option.short}</span>
                  <strong>{option.label}</strong>
                  <small>
                    {applicable.length} aplicables · {direct} directos
                  </small>
                </button>
              );
            })}
          </div>
        </section>

      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <img src="/brand/deloitte-logo.png" alt="Deloitte" />

        </div>
        <p>Confidencial · Uso interno Deloitte · Catálogo actualizado a 08/09/2026</p>
        <a href="#inicio">Volver arriba ↑</a>
      </footer>

      {selected && (
        <CaseModal
          item={selected}
          position={selectedIndex}
          total={filtered.length}
          onClose={() => setSelectedId(null)}
          onPrevious={() => {
            if (selectedIndex > 0) setSelectedId(filtered[selectedIndex - 1].id);
          }}
          onNext={() => {
            if (selectedIndex < filtered.length - 1)
              setSelectedId(filtered[selectedIndex + 1].id);
          }}
        />
      )}
    </>
  );
}
