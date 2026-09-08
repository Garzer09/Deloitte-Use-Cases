# Criterios del catálogo

Revisión editorial del 8 de septiembre de 2026. Se conservan los 205 identificadores originales y se añaden COR-41 a COR-52: 12 propuestas de práctica comunes a todas las áreas corporativas. El catálogo contiene 217 casos, de los cuales 113 tienen aplicabilidad corporativa directa o con adaptación; 52 pertenecen al bloque de origen Corporativas.

## Clasificación

- **Tareas:** etiquetas múltiples según el trabajo y la salida del caso. La familia visible corresponde a su tarea principal. Correo, reuniones, comunicaciones, presentaciones y revisión documental se distinguen expresamente. Se han revisado las familias de todo el catálogo; 165 cambian de denominación o agrupación.
- **Herramientas:** nombres controlados, con varias herramientas por caso cuando intervienen en el flujo. Se conservan los textos descriptivos de capacidades y condiciones; un filtro por herramienta no acredita su disponibilidad en un entorno concreto.
- **Perfiles:** administrativo y secretariado, técnico o especialista, responsable de equipo y dirección. Pueden combinarse. La cobertura describe estos perfiles dentro del ámbito del caso; no convierte una práctica especialista en una práctica para toda la Firma.
- **Subáreas corporativas:** clasificación múltiple por contexto de aplicación. `common` identifica tareas que se pueden realizar en cualquier área corporativa. También se muestran al seleccionar una subárea concreta. Esta marca no implica que todas las personas realicen la tarea con igual frecuencia.
- **Preparación:** archivos/mensajes aportados, contenido organizado, configuración y apoyo de IT. Pueden coexistir requisitos. La etiqueta de archivos no elimina otros requisitos ni las condiciones de licencia.

La aplicabilidad a una línea de servicio y el banco de origen siguen siendo criterios independientes. Así se conservan, por ejemplo, casos del bloque Transversal que son aplicables a Corporativas. El cambio de área limpia la subárea corporativa; «Todas las áreas» limpia también la aplicabilidad directa/adaptada.

## Relación con el troncal

La comparación utiliza los materiales locales del módulo transversal vigentes en la revisión: las guías de Word, Excel, PowerPoint, Outlook, Teams, Researcher, Analyst, Notebooks, Pages, Agent Builder, Work IQ, contexto y fuentes, ejemplos y prompts, tareas programadas y prompting avanzado. Se contrastaron también las prácticas de Excel y PowerPoint descritas en los README de materiales del alumno y la estructura C001–C026 del programa. Las fuentes internas se mantienen fuera del repositorio público.

Cada ficha identifica los temas de referencia y explica la clasificación:

| Relación | Criterio |
| --- | --- |
| Práctica ya cubierta | El trabajo principal ya se practica en las guías transversales. Una clase adicional necesitaría un encargo y una salida distintos. |
| Aplicación complementaria | Aplica capacidades conocidas a otro encargo y resultado concreto. No implica una herramienta nueva. |
| Proceso que combina funcionalidades | El valor está en la secuencia, los traspasos de información y los controles entre resultados. Puede combinar funciones dentro de una aplicación o varias aplicaciones. |
| Sin correspondencia directa | La práctica requiere capacidades o configuración que no se corresponden directamente con las prácticas revisadas, aunque comparta fundamentos. |

Son juicios editoriales para ayudar a seleccionar clases, no una declaración de qué sesiones ha cursado cada participante ni una aprobación definitiva del itinerario. Deben revisarse si cambia el troncal.

## Nuevas prácticas comunes

| ID | Trabajo | Diferencia principal |
| --- | --- | --- |
| COR-41 | Adaptar una exportación a la plantilla del equipo | Mapeo de campos, incidencias y criterios de aceptación antes del reporting. |
| COR-42 | Conciliar dos listados | Cola de diferencias con claves y procedencia, en vez de un análisis general de tendencias. |
| COR-43 | Consolidar aportaciones de varios equipos | Cobertura de recepción, versiones y trazabilidad por fila. |
| COR-44 | Convertir peticiones en un registro de trabajo | Registro operativo de solicitudes sin depender de reuniones o integración con tickets. |
| COR-45 | Comprobar la completitud de un expediente | Matriz contra checklist y borrador de subsanación, sin un proceso departamental específico. |
| COR-46 | Convertir un procedimiento en una guía operativa | Instrucciones y checklist de ejecución a partir de una fuente aprobada. |
| COR-47 | Preparar un relevo de tareas | Estado, documentos y siguientes pasos sin una nueva reunión. |
| COR-48 | Contrastar cifras y relato | Coherencia entre datos de Excel, nota y presentación con controles localizables. |
| COR-49 | Clasificar comentarios abiertos | Rúbrica, ejemplos, ambigüedades y recuentos para feedback de cualquier servicio interno. |
| COR-50 | Crear una plantilla de comunicación recurrente | Variables, campos obligatorios y detección de datos de la edición anterior. |
| COR-51 | Comparar carga de trabajo por escenarios | Capacidad agregada, esfuerzo y plazos; no evaluación ni asignación automática de personas. |
| COR-52 | Revisar consistencia terminológica | Glosario común entre documentos, sin sustituciones indiscriminadas. |

Todas parten de archivos o mensajes aportados. La extracción del sistema, los traspasos entre aplicaciones y los envíos se realizan con intervención de la persona. Cada ficha contiene entradas, pasos, resultado, prompt y controles, junto con su diferencia frente al catálogo o al troncal. Son propuestas de práctica, no implantaciones acreditadas ni ahorros medidos.

## Base funcional de las nuevas prácticas

Las capacidades utilizadas se contrastaron con documentación oficial de Microsoft:

- [Editar con Copilot en Excel](https://support.microsoft.com/en-us/office/agent-mode-in-excel-frontier-a2fd6fe4-97ac-416b-b89a-22f4d1357c7a): tablas, fórmulas, gráficos y edición revisable del libro. Las prácticas incorporan manualmente las fuentes para evitar depender de conectores.
- [Redactar y añadir contenido con Copilot en Word](https://support.microsoft.com/en-gb/copilot-word): borradores, referencias y adición de contenido. Las nuevas prácticas no requieren la experiencia de edición de Word en Frontier.
- [Conversar con Copilot en Outlook](https://support.microsoft.com/en-us/outlook/copilot-outlook/chat-with-copilot-in-outlook): trabajo contextual con mensajes y borradores. No se presupone soporte equivalente para buzones compartidos o delegados.
- [Editar con Copilot en PowerPoint](https://support.microsoft.com/en-us/powerpoint/edit-with-copilot-in-powerpoint): consulta y revisión del contenido de la presentación. La coherencia de cifras se contrasta además con el Excel de referencia.

Se mantienen las notas funcionales y fuentes del catálogo original con su fecha del 31/07/2026. La revisión de clasificación no revalida silenciosamente las capacidades antiguas, las condiciones del tenant ni las funciones en preview.

## Mantenimiento

Los valores admitidos están en `lib/catalogue.ts`; cada registro guarda sus etiquetas en `data/cases.json`. Al añadir o cambiar un caso se deben revisar todas las facetas y su justificación respecto al troncal. `npm run test:catalogue` comprueba integridad, combinaciones, casos comunes por subárea, búsqueda, recuentos, reinicio y ordenación. `npm test` añade compilación y verificación del HTML servido.
