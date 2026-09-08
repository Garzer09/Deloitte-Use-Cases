"use client";

import { useMemo } from "react";
import {
  audienceOptions, blockOptions, coreOptions, corporateAreaOptions, coverageOptions,
  defaultFilters, facetCounts, labelFor, preparationOptions, statusOptions, taskOptions,
  toolOptions, type CaseItem, type Filters, type MultiFilter, type Option,
} from "@/lib/catalogue";

export const areaOptions = [
  { key: "all", label: "Todas las áreas", short: "Todas" },
  { key: "A&A", label: "Audit & Assurance", short: "A&A" },
  { key: "T&L", label: "Tax & Legal", short: "T&L" },
  { key: "SRT", label: "Strategy, Risk & Transactions", short: "SRT" },
  { key: "T&T", label: "Technology & Transformation", short: "T&T" },
  { key: "Corp", label: "Áreas Corporativas", short: "Corp" },
] as const;

const facets: { key: MultiFilter; label: string; options: Option[] }[] = [
  { key: "tasks", label: "Tarea", options: taskOptions },
  { key: "tools", label: "Herramienta o capacidad", options: toolOptions },
  { key: "audiences", label: "Nivel profesional", options: audienceOptions },
  { key: "corporateAreas", label: "Subárea corporativa", options: corporateAreaOptions },
  { key: "preparation", label: "Preparación necesaria", options: preparationOptions },
];
const singles: { key: keyof Filters; label: string; options: Option[] }[] = [
  { key: "coreRelation", label: "Relación con el troncal", options: coreOptions },
  { key: "applicability", label: "Aplicabilidad", options: [{ value: "direct", label: "Aplicación directa" }, { value: "adapted", label: "Con adaptación" }] },
  { key: "origin", label: "Banco de origen", options: blockOptions.map(label => ({ value: label, label })) },
  { key: "coverage", label: "Cobertura de perfiles", options: coverageOptions.map(label => ({ value: label, label })) },
  { key: "maturity", label: "Disponibilidad de la capacidad", options: ["GA", "GA condicionado", "Preview"].map(label => ({ value: label, label })) },
  { key: "status", label: "Cartera", options: statusOptions.map(label => ({ value: label, label })) },
];

function MultiSelect({ label, options, selected, counts, onChange }: {
  label: string; options: Option[]; selected: string[];
  counts: Record<string, number>; onChange: (values: string[]) => void;
}) {
  return (
    <fieldset className="facet">
      <legend>{label}</legend>
      <details className="facet-picker">
        <summary>{selected.length ? selected.map(v => labelFor(options, v)).join(", ") : "Cualquiera"}</summary>
        <div className="facet-options">
          {options.map(option => (
            <label className="facet-option" key={option.value}>
              <input type="checkbox" checked={selected.includes(option.value)}
                onChange={() => onChange(selected.includes(option.value) ? selected.filter(v => v !== option.value) : [...selected, option.value])} />
              <span>{option.label}</span>
              <span className="facet-count" aria-label={`${counts[option.value] ?? 0} casos`}>{counts[option.value] ?? 0}</span>
            </label>
          ))}
        </div>
      </details>
    </fieldset>
  );
}

export function CatalogueFilters({ items, filters, onChange, onReset, total }: {
  items: CaseItem[]; filters: Filters;
  onChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  onReset: () => void; total: number;
}) {
  const counts = useMemo(() => Object.fromEntries(facets.map(f => [f.key, facetCounts(items, filters, f.key, f.options)])), [items, filters]);
  const chips: { key: string; label: string; remove: () => void }[] = [];
  if (filters.query.trim()) chips.push({ key: "query", label: `Buscar: ${filters.query}`, remove: () => onChange("query", "") });
  if (filters.area !== "all") chips.push({ key: "area", label: areaOptions.find(a => a.key === filters.area)!.label, remove: () => onChange("area", "all") });
  for (const facet of facets) {
    for (const value of filters[facet.key]) chips.push({ key: `${facet.key}-${value}`, label: `${facet.label}: ${labelFor(facet.options, value)}`, remove: () => onChange(facet.key, filters[facet.key].filter(v => v !== value)) });
  }
  for (const field of singles) {
    const value = filters[field.key] as string;
    if (value !== "all") chips.push({ key: field.key, label: `${field.label}: ${labelFor(field.options, value)}`, remove: () => onChange(field.key, "all") });
  }
  const advancedCount = filters.preparation.length + singles.filter(f => filters[f.key] !== "all").length;
  const renderFacet = (key: MultiFilter) => {
    const facet = facets.find(f => f.key === key)!;
    return <MultiSelect key={key} label={facet.label} options={facet.options} selected={filters[key]} counts={counts[key]} onChange={value => onChange(key, value)} />;
  };

  return (
    <div className="filter-panel">
      <label className="search-field"><span>Buscar en el catálogo</span>
        <input type="search" value={filters.query} onChange={event => onChange("query", event.target.value)} placeholder="Ej. conciliar listados, relevo, presentación…" />
      </label>
      <div className="filter-grid primary-filters">
        <label><span>Área Deloitte</span>
          <select value={filters.area} onChange={event => onChange("area", event.target.value as Filters["area"])}>
            {areaOptions.map(a => <option value={a.key} key={a.key}>{a.label}</option>)}
          </select>
        </label>
        {renderFacet("tasks")}{renderFacet("tools")}{renderFacet("audiences")}
      </div>
      <p className="filter-help">Staff incluye personal administrativo y técnico hasta senior; Managers incluye managers y senior managers. Directores / Socios completa los niveles. Un caso puede ser útil en varios niveles; Corporativas se elige en Área Deloitte.</p>
      {filters.area === "Corp" && (
        <div className="corporate-filter">
          {renderFacet("corporateAreas")}
          <p>Los casos comunes a todas las áreas también aparecen al elegir una subárea. El área indica dónde se aplica la práctica y el nivel profesional, a quién puede resultar útil.</p>
        </div>
      )}
      <p className="filter-help">Puedes elegir varias opciones: se suman dentro de cada filtro y se combinan con los demás. Los recuentos tienen en cuenta los otros filtros activos.</p>
      <details className="advanced-filters">
        <summary>Más filtros{advancedCount > 0 ? ` (${advancedCount})` : ""}</summary>
        <div className="filter-grid">
          {renderFacet("preparation")}
          {singles.map(field => (
            <label key={field.key}><span>{field.label}</span>
              <select value={filters[field.key] as string} disabled={field.key === "applicability" && filters.area === "all"} onChange={event => onChange(field.key, event.target.value)}>
                <option value="all">Cualquiera</option>
                {field.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
          ))}
        </div>
        <p className="filter-help">«Archivos o mensajes aportados» describe una entrada de trabajo, no una licencia. Algunas prácticas también necesitan configuración o apoyo de IT; consulta las condiciones de la ficha. La relación con el troncal compara prácticas y resultados, no solo herramientas.</p>
      </details>
      {chips.length > 0 && <div className="active-filters" aria-label="Filtros activos">
        {chips.map(chip => <button key={chip.key} type="button" onClick={chip.remove} aria-label={`Quitar ${chip.label}`}>{chip.label}<span aria-hidden="true"> ×</span></button>)}
      </div>}
      <div className="filter-footer">
        <p role="status" aria-live="polite" aria-atomic="true"><strong>{total}</strong> {total === 1 ? "caso encontrado" : "casos encontrados"}</p>
        <label className="sort-field"><span>Orden</span>
          <select value={filters.sort} onChange={event => onChange("sort", event.target.value)}>
            <option value="bank">Orden del banco</option><option value="newest">Nuevos primero</option><option value="title">Título A–Z</option><option value="id">ID del caso</option>
          </select>
        </label>
        <button onClick={onReset} disabled={!chips.length && filters.sort === defaultFilters.sort}>Limpiar filtros{chips.length > 0 ? ` (${chips.length})` : ""}</button>
      </div>
    </div>
  );
}
