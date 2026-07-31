"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import rawData from "@/data/cases.json";

type AreaKey = "A&A" | "T&L" | "SRT" | "T&T" | "Corp";

type CaseItem = {
  id: string;
  block: string;
  title: string;
  description: string;
  primary: string;
  involved: string;
  areas: Record<AreaKey, string>;
  profiles: string;
  status: string;
  coverage: string;
  route: string;
  family: string;
  deliverable: string;
  maturity: string;
  level: string;
  conditions: string;
  humanReview: string;
  auditFinding: string;
  microsoftSource: string;
  deloitteSource: string;
};

type AreaOption = {
  key: "all" | AreaKey;
  label: string;
  short: string;
  block?: string;
};

const cases = rawData.cases as CaseItem[];
const PAGE_SIZE = 24;

const areaOptions: AreaOption[] = [
  { key: "all", label: "Todas las áreas", short: "Todas" },
  {
    key: "A&A",
    label: "Audit & Assurance",
    short: "A&A",
    block: "Audit & Assurance",
  },
  {
    key: "T&L",
    label: "Tax & Legal",
    short: "T&L",
    block: "Tax & Legal",
  },
  {
    key: "SRT",
    label: "Strategy, Risk & Transactions",
    short: "SRT",
    block: "Strategy, Risk & Transactions",
  },
  {
    key: "T&T",
    label: "Technology & Transformation",
    short: "T&T",
    block: "Technology & Transformation",
  },
  {
    key: "Corp",
    label: "Áreas Corporativas",
    short: "Corp",
    block: "Áreas Corporativas",
  },
];

const blockOptions = [
  "Transversal",
  "Audit & Assurance",
  "Tax & Legal",
  "Strategy, Risk & Transactions",
  "Technology & Transformation",
  "Áreas Corporativas",
];

const blockRank = new Map(blockOptions.map((block, index) => [block, index]));

const statusOptions = [
  "Propuesta inicial del itinerario",
  "En el inventario del área, a elección",
  "Banco extendido, no incluido aún",
];

const coverageOptions = [
  "Todos los perfiles",
  "Mayoría del negocio",
  "Especialista / subárea",
];

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const compact = (value: string, max = 236) =>
  value.length > max ? `${value.slice(0, max).trimEnd()}…` : value;

const levelShort = (level: string) => level.split(" · ")[0];

const maturityType = (maturity: string) => {
  if (maturity.toLowerCase().includes("preview")) return "Preview";
  if (maturity.toLowerCase().includes("condicionado")) return "GA condicionado";
  return "GA";
};

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
      <div className="brand-author">
        <span>Preparado por</span>
        <img src="/brand/spiralia-wordmark.png" alt="Spiralia" />
      </div>
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
            <span className="section-kicker">Criterio de auditoría</span>
            <p>{item.auditFinding}</p>
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
            <a href={item.deloitteSource} target="_blank" rel="noreferrer">
              Deloitte ↗
            </a>
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
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<"all" | AreaKey>("all");
  const [applicability, setApplicability] = useState("all");
  const [origin, setOrigin] = useState("all");
  const [coverage, setCoverage] = useState("all");
  const [level, setLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const [maturity, setMaturity] = useState("all");
  const [sort, setSort] = useState("bank");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    return cases
      .filter((item) => {
        const areaMark = area === "all" ? "" : item.areas[area];
        const searchable = normalize(
          [
            item.id,
            item.title,
            item.description,
            item.family,
            item.primary,
            item.involved,
            item.profiles,
            item.block,
          ].join(" "),
        );

        return (
          (!normalizedQuery || searchable.includes(normalizedQuery)) &&
          (area === "all" || Boolean(areaMark)) &&
          (applicability === "all" ||
            area === "all" ||
            (applicability === "direct" ? areaMark === "●" : areaMark === "○")) &&
          (origin === "all" || item.block === origin) &&
          (coverage === "all" || item.coverage === coverage) &&
          (level === "all" || item.level.startsWith(level)) &&
          (status === "all" || item.status === status) &&
          (maturity === "all" || maturityType(item.maturity) === maturity)
        );
      })
      .sort((a, b) => {
        if (sort === "title") return a.title.localeCompare(b.title, "es");
        if (sort === "bank") {
          const blockDifference =
            (blockRank.get(a.block) ?? 99) - (blockRank.get(b.block) ?? 99);
          if (blockDifference !== 0) return blockDifference;
        }
        return a.id.localeCompare(b.id, "es", { numeric: true });
      });
  }, [applicability, area, coverage, level, maturity, origin, query, sort, status]);

  const selectedIndex = selectedId
    ? filtered.findIndex((item) => item.id === selectedId)
    : -1;
  const selected = selectedIndex >= 0 ? filtered[selectedIndex] : null;

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [applicability, area, coverage, level, maturity, origin, query, sort, status]);

  useEffect(() => {
    if (area === "all") setApplicability("all");
  }, [area]);

  useEffect(() => {
    if (selectedId && selectedIndex === -1) setSelectedId(null);
  }, [selectedId, selectedIndex]);

  const resetFilters = () => {
    setQuery("");
    setArea("all");
    setApplicability("all");
    setOrigin("all");
    setCoverage("all");
    setLevel("all");
    setStatus("all");
    setMaturity("all");
    setSort("bank");
  };

  const activeFilterCount = [
    Boolean(query.trim()),
    area !== "all",
    applicability !== "all",
    origin !== "all",
    coverage !== "all",
    level !== "all",
    status !== "all",
    maturity !== "all",
  ].filter(Boolean).length;

  const chooseArea = (key: AreaKey) => {
    setArea(key);
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
              205 casos auditados y trazables para diseñar itinerarios comunes,
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
            <span className="summary-label">Banco auditado · 31/07/2026</span>
            <strong>205</strong>
            <span className="summary-title">casos navegables</span>
            <div className="summary-breakdown">
              <div>
                <b>117</b>
                <span>base v0.1</span>
              </div>
              <div>
                <b>88</b>
                <span>incorporados</span>
              </div>
              <div>
                <b>5</b>
                <span>áreas Deloitte</span>
              </div>
            </div>
          </aside>
        </section>

        <section className="architecture" id="arquitectura">
          <div className="section-intro">
            <span className="kicker">Arquitectura recomendada</span>
            <h2>Universal donde aporta. Especialista donde importa.</h2>
            <p>
              El objetivo no es impartir 205 casos. Es seleccionar un tronco
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

        <section className="catalogue" id="banco">
          <div className="catalogue-heading">
            <div>
              <span className="kicker">Banco de casos</span>
              <h2>Encuentra la opción adecuada</h2>
            </div>
            <p>
              Busca por tarea, perfil o funcionalidad. Combina filtros para
              preparar una preselección antes de las reuniones con los negocios.
            </p>
          </div>

          <div className="filter-panel">
            <label className="search-field">
              <span>Buscar</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ej. contrato, reunión, riesgo, Excel…"
                type="search"
              />
            </label>

            <div className="filter-grid">
              <label>
                <span>Área Deloitte</span>
                <select value={area} onChange={(event) => setArea(event.target.value as "all" | AreaKey)}>
                  {areaOptions.map((option) => (
                    <option value={option.key} key={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Aplicabilidad</span>
                <select
                  value={applicability}
                  onChange={(event) => setApplicability(event.target.value)}
                  disabled={area === "all"}
                >
                  <option value="all">Directa + adaptada</option>
                  <option value="direct">Aplicación directa</option>
                  <option value="adapted">Con adaptación</option>
                </select>
              </label>

              <label>
                <span>Banco de origen</span>
                <select value={origin} onChange={(event) => setOrigin(event.target.value)}>
                  <option value="all">Todos los bloques</option>
                  {blockOptions.map((option) => (
                    <option value={option} key={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Cobertura</span>
                <select value={coverage} onChange={(event) => setCoverage(event.target.value)}>
                  <option value="all">Todos los niveles</option>
                  {coverageOptions.map((option) => (
                    <option value={option} key={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Nivel de solución</span>
                <select value={level} onChange={(event) => setLevel(event.target.value)}>
                  <option value="all">N1 + N2 + N3</option>
                  <option value="N1">N1 · Nativo</option>
                  <option value="N2">N2 · Configuración</option>
                  <option value="N3">N3 · Integración</option>
                </select>
              </label>

              <label>
                <span>Madurez</span>
                <select value={maturity} onChange={(event) => setMaturity(event.target.value)}>
                  <option value="all">Cualquier estado</option>
                  <option value="GA">GA</option>
                  <option value="GA condicionado">GA condicionado</option>
                  <option value="Preview">Preview</option>
                </select>
              </label>

              <label>
                <span>Cartera</span>
                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                  <option value="all">Toda la cartera</option>
                  {statusOptions.map((option) => (
                    <option value={option} key={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Orden</span>
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="bank">Orden del banco</option>
                  <option value="id">ID del caso</option>
                  <option value="title">Título A–Z</option>
                </select>
              </label>
            </div>

            <div className="filter-footer">
              <p aria-live="polite">
                <strong>{filtered.length}</strong>{" "}
                {filtered.length === 1 ? "caso encontrado" : "casos encontrados"}
              </p>
              <button onClick={resetFilters} disabled={activeFilterCount === 0}>
                Limpiar filtros {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
            </div>
          </div>

          {filtered.length > 0 ? (
            <>
              <div className="case-grid">
                {filtered.slice(0, visible).map((item) => {
                  const selectedAreaMark =
                    area === "all" ? "" : item.areas[area as AreaKey];
                  return (
                    <article className="case-card" key={item.id}>
                      <div className="card-topline">
                        <span className="case-id">{item.id}</span>
                        <span className="card-block">{item.block}</span>
                      </div>
                      <div className="card-content">
                        <p className="card-family">{item.family}</p>
                        <h3>{item.title}</h3>
                        <p className="card-description">{compact(item.description)}</p>
                      </div>
                      <div className="card-tags">
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
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <img src="/brand/deloitte-logo.png" alt="Deloitte" />
          <span aria-hidden="true"></span>
          <img src="/brand/spiralia-logo.png" alt="Spiralia" />
        </div>
        <p>Confidencial · Uso interno Deloitte · Banco auditado a 31/07/2026</p>
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
