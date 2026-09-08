export type AreaKey = "A&A" | "T&L" | "SRT" | "T&T" | "Corp";
export type Option = { value: string; label: string };
export type CaseItem = {
  id: string; block: string; title: string; description: string;
  primary: string; involved: string; areas: Record<AreaKey, string | null>;
  profiles: string; status: string; coverage: string; route: string;
  family: string; deliverable: string; maturity: string; level: string;
  conditions: string; humanReview: string; auditFinding: string;
  microsoftSource: string; deloitteSource: string;
  tasks: string[]; tools: string[]; audiences: string[];
  corporateAreas: string[]; preparation: string[];
  coreRelation: string; coreLessons: string[]; coreRationale: string;
  addedOn?: string; reviewedOn?: string; input?: string; steps?: string[]; examplePrompt?: string;
  additionalSources?: { label: string; url: string }[];
  distinction?: string;
};

export const taskOptions: Option[] = [
  { value: "clean", label: "Limpiar y estructurar datos" },
  { value: "analyse", label: "Analizar y cruzar datos" },
  { value: "report", label: "Preparar informes" },
  { value: "present", label: "Crear o adaptar presentaciones" },
  { value: "communicate", label: "Redactar comunicaciones" },
  { value: "draft", label: "Crear documentos y materiales" },
  { value: "review", label: "Comparar y revisar documentos" },
  { value: "find", label: "Buscar y sintetizar información" },
  { value: "meet", label: "Preparar y resumir reuniones" },
  { value: "request", label: "Gestionar solicitudes y seguimientos" },
  { value: "plan", label: "Planificar y coordinar trabajo" },
  { value: "agent", label: "Crear agentes y automatizaciones" },
  { value: "govern", label: "Organizar conocimiento y controles" },
];
export const toolOptions: Option[] = [
  ...["Excel", "Word", "PowerPoint", "Outlook", "Teams", "Researcher", "Analyst", "SharePoint", "Agentes de SharePoint", "Copilot Chat", "Copilot Search", "Notebooks", "Pages", "Loop", "Agent Builder", "Copilot Studio", "Prompts programados", "Prompt Gallery", "People Skills", "Copilot Cowork", "Copilot móvil", "Brand kits", "Purview", "Work IQ"].map(label => ({ value: label, label })),
];
export const audienceOptions: Option[] = [
  { value: "staff", label: "Staff" },
  { value: "manager", label: "Managers" },
  { value: "leadership", label: "Directores / Socios" },
];
export const corporateAreaOptions: Option[] = [
  { value: "common", label: "Común a todas las áreas corporativas" },
  { value: "finance", label: "Finanzas y control de gestión" },
  { value: "procurement", label: "Compras" },
  { value: "talent", label: "Talento y personas" },
  { value: "learning", label: "Learning" },
  { value: "culture", label: "Cultura" },
  { value: "marketing", label: "Marketing y Comunicación" },
  { value: "growth", label: "Growth y desarrollo de negocio" },
  { value: "risk", label: "Riesgos, Legal y Calidad" },
  { value: "it", label: "Tecnología y conocimiento" },
  { value: "services", label: "Servicios generales y operaciones" },
  { value: "sustainability", label: "Sostenibilidad" },
];
export const preparationOptions: Option[] = [
  { value: "files", label: "Archivos o mensajes aportados" },
  { value: "content", label: "Contenido interno organizado y accesible" },
  { value: "agent", label: "Configurar un agente o una tarea" },
  { value: "it", label: "Integraciones o apoyo de IT" },
];
export const coreOptions: Option[] = [
  { value: "covered", label: "Práctica ya cubierta en el troncal" },
  { value: "complementary", label: "Aplicación complementaria" },
  { value: "workflow", label: "Proceso que combina funcionalidades" },
  { value: "outside", label: "Sin correspondencia directa en el troncal" },
];
export const blockOptions = ["Transversal", "Audit & Assurance", "Tax & Legal", "Strategy, Risk & Transactions", "Technology & Transformation", "Áreas Corporativas"];
export const statusOptions = ["Propuesta inicial del itinerario", "En el inventario del área, a elección", "Banco extendido, no incluido aún"];
export const coverageOptions = ["Todos los perfiles", "Mayoría del negocio", "Especialista / subárea"];
export const labelFor = (options: Option[], value: string) => options.find(o => o.value === value)?.label ?? value;
export const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export function maturityType(value: string) {
  if (/preview|frontier/i.test(value)) return "Preview";
  if (/condicionado/i.test(value)) return "GA condicionado";
  return "GA";
}

export type Filters = {
  query: string; area: "all" | AreaKey; tasks: string[]; tools: string[];
  audiences: string[]; corporateAreas: string[]; preparation: string[];
  coreRelation: string; applicability: string; origin: string;
  coverage: string; maturity: string; status: string; sort: string;
};
export const defaultFilters: Filters = {
  query: "", area: "all", tasks: [], tools: [], audiences: [], corporateAreas: [],
  preparation: [], coreRelation: "all", applicability: "all", origin: "all",
  coverage: "all", maturity: "all", status: "all", sort: "bank",
};
export type MultiFilter = "tasks" | "tools" | "audiences" | "corporateAreas" | "preparation";
const someSelected = (selected: string[], values: string[]) => !selected.length || selected.some(value => values.includes(value));
export function updateFilters<K extends keyof Filters>(filters: Filters, key: K, value: Filters[K]): Filters {
  const next = { ...filters, [key]: value };
  if (key === "area") {
    if (value !== "Corp") next.corporateAreas = [];
    if (value === "all") next.applicability = "all";
  }
  return next;
}

// OR within a facet, AND between facets. Shared corporate cases remain visible
// when selecting a specific corporate subarea; other business lines never match it.
export function matchesCase(item: CaseItem, filters: Filters): boolean {
  const mark = filters.area === "all" ? null : item.areas[filters.area];
  if (filters.area !== "all" && !mark) return false;
  if (filters.area !== "all" && filters.applicability !== "all" && mark !== (filters.applicability === "direct" ? "●" : "○")) return false;
  if (filters.origin !== "all" && item.block !== filters.origin) return false;
  if (filters.coverage !== "all" && item.coverage !== filters.coverage) return false;
  if (filters.status !== "all" && item.status !== filters.status) return false;
  if (filters.maturity !== "all" && maturityType(item.maturity) !== filters.maturity) return false;
  if (filters.coreRelation !== "all" && item.coreRelation !== filters.coreRelation) return false;
  for (const key of ["tasks", "tools", "audiences", "preparation"] as const) {
    if (!someSelected(filters[key], item[key])) return false;
  }
  if (filters.area === "Corp" && filters.corporateAreas.length && !item.corporateAreas.includes("common") && !someSelected(filters.corporateAreas, item.corporateAreas)) return false;
  const terms = normalize(filters.query.trim()).split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const searchable = normalize([
    item.id, item.title, item.description, item.family, item.primary, item.involved,
    item.profiles, item.block, item.deliverable, item.input ?? "", item.coreRationale,
    ...item.tasks.map(v => labelFor(taskOptions, v)), ...item.tools,
    ...item.audiences.map(v => labelFor(audienceOptions, v)),
    ...item.corporateAreas.map(v => labelFor(corporateAreaOptions, v)),
    ...item.preparation.map(v => labelFor(preparationOptions, v)),
  ].join(" "));
  return terms.every(term => searchable.includes(term));
}
export function filterCases(items: CaseItem[], filters: Filters): CaseItem[] {
  return items.filter(item => matchesCase(item, filters)).sort((a, b) => {
    if (filters.sort === "title") return a.title.localeCompare(b.title, "es");
    if (filters.sort === "newest") {
      const byDate = (b.addedOn ?? "").localeCompare(a.addedOn ?? "");
      if (byDate) return byDate;
    }
    if (filters.sort === "bank") {
      const byBlock = blockOptions.indexOf(a.block) - blockOptions.indexOf(b.block);
      if (byBlock) return byBlock;
    }
    return a.id.localeCompare(b.id, "es", { numeric: true });
  });
}
export function facetCounts(items: CaseItem[], filters: Filters, key: MultiFilter, options: Option[]): Record<string, number> {
  const otherFilters = { ...filters, [key]: [] };
  const pool = items.filter(item => matchesCase(item, otherFilters));
  return Object.fromEntries(options.map(option => [option.value, pool.filter(item => matchesCase(item, { ...otherFilters, [key]: [option.value] })).length]));
}
