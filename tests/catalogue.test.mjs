import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  audienceOptions, coreOptions, corporateAreaOptions, defaultFilters, facetCounts,
  filterCases, preparationOptions, taskOptions, toolOptions, updateFilters,
} from "../lib/catalogue.ts";

const data = JSON.parse(await readFile(new URL("../data/cases.json", import.meta.url), "utf8"));
const cases = data.cases;
const byId = id => cases.find(c => c.id === id);
const ids = filters => filterCases(cases, { ...defaultFilters, ...filters }).map(c => c.id);

test("retains the original 205 IDs and adds 12 complete common corporate practices", () => {
  assert.equal(data.total, 217);
  assert.equal(cases.length, data.total);
  assert.equal(new Set(cases.map(c => c.id)).size, cases.length);
  assert.equal(new Set(cases.map(c => c.title)).size, cases.length);
  for (const [prefix, length] of Object.entries({ TRV: 25, AUD: 30, TAX: 35, SRT: 35, TYT: 40, COR: 40 })) {
    for (let n = 1; n <= length; n++) assert.ok(byId(`${prefix}-${String(n).padStart(2, "0")}`));
  }
  const added = cases.filter(c => c.addedOn);
  assert.equal(added.length, 12);
  for (const item of added) {
    assert.deepEqual(item.corporateAreas, ["common"], item.id);
    assert.equal(item.areas.Corp, "●");
    assert.deepEqual(item.preparation, ["files"]);
    assert.match(item.level, /^N1/);
    assert.ok(item.input && item.examplePrompt && item.distinction && item.deliverable && item.humanReview);
    assert.ok(item.steps.length >= 3);
    assert.ok(item.coreLessons.length);
    assert.match(item.microsoftSource, /^https:\/\/support\.microsoft\.com\//);
  }
});

test("all 217 records use the controlled taxonomy, with justified core relationships", () => {
  const schema = { tasks: taskOptions, tools: toolOptions, audiences: audienceOptions, corporateAreas: corporateAreaOptions, preparation: preparationOptions };
  for (const item of cases) {
    for (const [key, options] of Object.entries(schema)) {
      assert.ok(Array.isArray(item[key]), `${item.id}: ${key}`);
      assert.equal(new Set(item[key]).size, item[key].length, `${item.id}: duplicate ${key}`);
      for (const value of item[key]) assert.ok(options.some(o => o.value === value), `${item.id}: unknown ${key} ${value}`);
      if (key !== "corporateAreas") assert.ok(item[key].length, `${item.id}: empty ${key}`);
    }
    assert.equal(Boolean(item.areas.Corp), item.corporateAreas.length > 0, item.id);
    assert.ok(coreOptions.some(o => o.value === item.coreRelation), item.id);
    assert.ok(item.coreRationale.length > 40, item.id);
    if (item.coreRelation !== "outside") assert.ok(item.coreLessons.length, item.id);
  }
});

test("corrects the misleading legacy families without mixing inbox and meetings", () => {
  assert.equal(byId("COR-07").family, "Presentaciones");
  assert.equal(byId("COR-13").family, "Documentos y materiales");
  assert.equal(byId("COR-11").family, "Comunicaciones");
  assert.ok(!byId("COR-01").tasks.includes("meet"));
  assert.ok(!byId("COR-14").tasks.includes("meet"));
});

test("combines area, task, tool and administrative profile", () => {
  const result = ids({ area: "Corp", tasks: ["clean"], tools: ["Excel"], audiences: ["admin"] });
  assert.ok(result.includes("COR-41"));
  assert.ok(result.includes("COR-43"));
  assert.ok(!result.includes("COR-46"));
  assert.ok(!result.includes("TAX-24"));
});

test("uses OR for tools and AND between tools and tasks", () => {
  const options = { area: "Corp", tasks: ["review"] };
  const combined = new Set(ids({ ...options, tools: ["Excel", "Word"] }));
  const expected = new Set([...ids({ ...options, tools: ["Excel"] }), ...ids({ ...options, tools: ["Word"] })]);
  assert.deepEqual(combined, expected);
  assert.ok(combined.has("COR-41") && combined.has("COR-46"));
  assert.ok(!combined.has("COR-19"));
});

test("preserves all common corporate cases for each subarea, with specific cases scoped", () => {
  const added = cases.filter(c => c.addedOn).map(c => c.id);
  for (const option of corporateAreaOptions) {
    const result = ids({ area: "Corp", corporateAreas: [option.value] });
    for (const id of added) assert.ok(result.includes(id), `${option.value}: ${id}`);
  }
  const learning = ids({ area: "Corp", corporateAreas: ["learning"] });
  assert.ok(learning.includes("COR-16"));
  assert.ok(!learning.includes("COR-09"));
  const common = ids({ area: "Corp", corporateAreas: ["common"] });
  assert.ok(!common.includes("COR-16"));
  assert.ok(!common.includes("COR-09"));
});

test("keeps corporate applicability distinct from bank of origin", () => {
  const applicable = ids({ area: "Corp" });
  assert.ok(applicable.includes("TRV-01"));
  assert.ok(applicable.includes("TAX-12"));
  assert.equal(applicable.length, 113);
  assert.equal(ids({ origin: "Áreas Corporativas" }).length, 52);
  const direct = ids({ area: "Corp", applicability: "direct" });
  const adapted = ids({ area: "Corp", applicability: "adapted" });
  assert.equal(direct.length + adapted.length, applicable.length);
  assert.ok(!direct.some(id => adapted.includes(id)));
});

test("area changes clear inapplicable facets and reset is complete", () => {
  const selected = { ...defaultFilters, area: "Corp", corporateAreas: ["learning"], applicability: "direct", tasks: ["review"], sort: "newest" };
  const tax = updateFilters(selected, "area", "T&L");
  assert.deepEqual(tax.corporateAreas, []);
  assert.equal(tax.applicability, "direct");
  const all = updateFilters(selected, "area", "all");
  assert.deepEqual(all.corporateAreas, []);
  assert.equal(all.applicability, "all");
  assert.equal(filterCases(cases, defaultFilters).length, 217);
});

test("search is insensitive to accents and matches separated words and taxonomy labels", () => {
  assert.ok(ids({ query: "exportacion plantilla" }).includes("COR-41"));
  assert.ok(ids({ query: "administrativo relevo" }).includes("COR-47"));
  assert.deepEqual(ids({ query: "cor-52" }), ["COR-52"]);
  assert.deepEqual(ids({ query: "exportación plantilla" }), ids({ query: "EXPORTACION plantilla" }));
});

test("counts are disjunctive and do not collapse a multiple-choice facet", () => {
  const filters = { ...defaultFilters, area: "Corp", tasks: ["review"], tools: ["Excel"] };
  const counts = facetCounts(cases, filters, "tools", toolOptions);
  assert.equal(counts.Word, ids({ area: "Corp", tasks: ["review"], tools: ["Word"] }).length);
  assert.ok(counts.Word > 0);
  const subs = facetCounts(cases, { ...defaultFilters, area: "Corp" }, "corporateAreas", corporateAreaOptions);
  assert.ok(subs.learning >= subs.common);
});

test("advanced filters combine with primary filters and handle zero matches", () => {
  const results = ids({ area: "Corp", tasks: ["clean"], preparation: ["files"], coreRelation: "complementary" });
  assert.ok(results.includes("COR-41"));
  assert.ok(!results.includes("COR-44"));
  assert.deepEqual(ids({ area: "Corp", query: "cor-41", tools: ["Copilot Studio"] }), []);
  assert.ok(ids({ area: "Corp", maturity: "GA condicionado" }).includes("COR-41"));
});

test("newest order surfaces the twelve additions and filtering never mutates source", () => {
  const before = cases.map(c => c.id);
  const sorted = filterCases(cases, { ...defaultFilters, sort: "newest" });
  assert.ok(sorted.slice(0, 12).every(c => c.addedOn === "2026-09-08"));
  assert.deepEqual(cases.map(c => c.id), before);
});
