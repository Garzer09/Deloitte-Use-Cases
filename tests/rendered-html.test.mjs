import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html", host: "localhost" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the searchable Copilot use-case bank", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>Banco de casos de uso · Microsoft 365 Copilot · Deloitte<\/title>/i,
  );
  assert.match(html, /Un banco de casos para/);
  assert.match(html, />217</);
  assert.match(html, /TRV-01/);
  assert.match(html, /Explorar los casos/);
  assert.match(html, /Encuentra la opción adecuada/);
  assert.match(html, /Herramienta o capacidad/);
  assert.match(html, /Más filtros/);
  assert.match(html, /Relación con el troncal/);
  assert.match(html, /Nuevos primero/);
  assert.doesNotMatch(html, /Spiralia|spiralia-logo|spiralia-wordmark|spiralia-symbol|og\.png/);
  assert.ok(html.indexOf('id="banco"') < html.indexOf('id="arquitectura"'));
  assert.doesNotMatch(html, /base v0\.1|incorporados|>117<|>88</i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("keeps all 217 cases complete and uniquely identified", async () => {
  const source = JSON.parse(
    await readFile(new URL("../data/cases.json", import.meta.url), "utf8"),
  );
  assert.equal(source.total, 217);
  assert.equal(source.cases.length, 217);
  assert.equal(new Set(source.cases.map((item) => item.id)).size, 217);

  const required = [
    "id",
    "block",
    "title",
    "description",
    "primary",
    "areas",
    "profiles",
    "coverage",
    "route",
    "deliverable",
    "maturity",
    "level",
    "humanReview",
  ];
  for (const item of source.cases) {
    for (const field of required) {
      assert.ok(item[field], `${item.id} is missing ${field}`);
    }
  }
});

test("ships the Deloitte identity without previous co-brand assets", async () => {
  await access(new URL("../public/brand/deloitte-logo.png", import.meta.url));
  for (const file of ["spiralia-logo.png", "spiralia-wordmark.png", "spiralia-symbol.png"]) {
    await assert.rejects(access(new URL(`../public/brand/${file}`, import.meta.url)));
  }
});
