# Deloitte · Banco de casos de Microsoft 365 Copilot

Aplicación con 227 casos de uso, búsqueda, filtros combinables y fichas de detalle. Incluye 22 nuevas prácticas comunes a todas las áreas corporativas.

- Repositorio: https://github.com/Garzer09/Deloitte-Use-Cases
- Web: https://spiralia-deloitte-use-cases.vercel.app
- Proyecto de Vercel: `spiralia-deloitte-use-cases`
- Rama de producción: `main`

## Desarrollo local con Next.js

Requiere Node.js 24 LTS y npm. Desde una carpeta nueva:

```bash
git clone https://github.com/Garzer09/Deloitte-Use-Cases.git
cd Deloitte-Use-Cases
npm ci
npx next dev
```

Abre la dirección local que muestra el terminal. Para compilar y arrancar la versión de producción:

```bash
npx next build
npx next start
```

La aplicación principal no necesita variables de entorno ni una base de datos: los casos se leen de `data/cases.json`.

## Buscar y seleccionar casos

Los filtros principales son Área Deloitte, Tarea, Herramienta o capacidad y Nivel profesional. Las opciones múltiples se suman dentro de un filtro (OR) y se cruzan entre filtros (AND). Los recuentos de cada opción mantienen el contexto de los otros filtros.

Al elegir Corporativas aparece Subárea. Los casos etiquetados como comunes a todas las áreas corporativas también aparecen en cada subárea. «Común» describe aplicabilidad entre áreas; el nivel profesional distingue Staff, Managers y Directores / Socios, y puede combinarse con cualquier área.

«Más filtros» incluye preparación, relación con el troncal, aplicabilidad directa/adaptada, origen, cobertura, disponibilidad y cartera. «Nuevos primero» sitúa las 22 incorporaciones al inicio. El buscador ignora tildes y mayúsculas y busca todas las palabras, aunque estén separadas.

La clasificación se revisó el 08/09/2026. COR-12 desarrolla la creación de un agente de SharePoint y COR-40 corrige sus requisitos administrativos. Las demás notas funcionales anteriores conservan su fecha original: no se ha convertido una revisión editorial en una nueva auditoría de producto. Consulta [los criterios del catálogo](docs/criterios-catalogo.md).

## Dónde hacer cambios

| Archivo | Contenido |
| --- | --- |
| `data/cases.json` | Casos de uso y sus campos |
| `app/page.tsx` | Página y fichas de los casos |
| `app/catalogue-filters.tsx` | Controles de filtros, recuentos y selecciones activas |
| `lib/catalogue.ts` | Taxonomía, búsqueda y reglas de combinación |
| `app/globals.css` | Estilos y diseño adaptable |
| `app/layout.tsx` | Título, metadatos e iconos |
| `public/` | Imágenes y marcas |
| `vercel.json` | Configuración del despliegue con Next.js |

## Publicar cambios

Crea una rama para cada cambio, comprueba la compilación y abre un pull request hacia `main`. Vercel está conectado a este repositorio: los cambios en `main` generan un despliegue de producción. Las ramas y los pull requests permiten revisar despliegues de vista previa.

```bash
git switch -c mejora-catalogo
# Edita los archivos y comprueba la compilación.
npx next build
git add app/page.tsx
git commit -m "Mejorar el catálogo de casos"
git push -u origin mejora-catalogo
```

Selecciona en `git add` los archivos que hayas modificado. No subas `.env`, credenciales, `node_modules`, `.next` ni `.vercel`; están excluidos mediante `.gitignore`.

## Compatibilidad con el proyecto original

Se conserva el código y el historial de la versión desplegada en Vercel el 31 de julio de 2026, cuyo commit es `f288ee4668e3849817322d8cd490b82df7f4df65`.

El proyecto original también incluye Vinext y soporte opcional para Sites/Cloudflare. Por eso `npm run dev`, `npm run build` y `npm start` usan Vinext. Para trabajar con el mismo motor de Vercel utiliza los comandos `npx next ...` de arriba; `vercel.json` ya establece `npx next build` como compilación de producción.

Se conservan `worker/`, `build/`, `.openai/hosting.json`, `db/`, `drizzle/` y `examples/d1/` para mantener esa compatibilidad. Las carpetas de base de datos contienen soporte opcional y ejemplos, no una dependencia de la aplicación principal.

```bash
npm test       # Compila con Vinext y verifica los filtros, el HTML y los 227 casos.
npm run lint  # Revisión de código.
```

La identidad visual del entregable utiliza únicamente la marca Deloitte, conforme a las normas del proyecto.
