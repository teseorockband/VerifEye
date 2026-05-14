# VerifEye

Aplicación web progresiva (PWA) que permite a los consumidores consultar información sobre el origen de productos y los vínculos corporativos de sus fabricantes.

## Stack técnico

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Estilos**: Tailwind CSS
- **Base de datos**: Supabase (PostgreSQL + RLS)
- **i18n**: next-intl (ES / EN / FR / IT)
- **Escaneo**: ZXing Library (`@zxing/library`)
- **Offline**: Service Worker + IndexedDB (idb)
- **Tests**: Vitest + Testing Library
- **CI/CD**: GitHub Actions → Vercel

## Variables de entorno

Crea un archivo `.env.local` a partir de `.env.local.example`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup de Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Ejecuta en el SQL Editor:

```sql
-- 1. Migración inicial
\i supabase/migrations/001_initial_schema.sql

-- 2. Datos de ejemplo (desarrollo)
\i supabase/seed/001_seed.sql
```

## Desarrollo local

```bash
npm install
npm run dev     # http://localhost:3000
npm run test    # Vitest
npm run lint    # ESLint
```

## Estructura del proyecto

```
app/
├── [locale]/          # Rutas i18n (es/en/fr/it)
│   ├── page.tsx       # Home con buscador
│   ├── scan/          # Escáner de código de barras
│   ├── product/[ean]/ # Ficha de producto
│   ├── directory/     # Directorio filtrable
│   └── report/        # Formulario de reporte comunitario
└── api/
    ├── barcode/[ean]/ # Búsqueda por EAN
    ├── search/        # Autocompletado
    ├── products/      # Listado con filtros
    ├── reports/       # Reportes comunitarios
    └── dispute/       # Solicitudes de revisión

lib/
├── classification/    # Lógica de niveles de vínculo (testeable)
├── supabase/          # Clientes server/browser y tipos
└── openfoodfacts/     # Fallback a Open Food Facts API

supabase/
├── migrations/        # Schema SQL
└── seed/              # Datos mock (50 productos)
```

---

## Metodología de clasificación

### Niveles de vínculo

| Nivel | Color | Descripción |
|-------|-------|-------------|
| `none` | Verde | Sin vínculo documentado con fuente verificable |
| `indirect` | Amarillo | Empresa matriz, subsidiaria o joint venture con presencia comercial en Israel |
| `direct` | Naranja | Empresa con operaciones directas, contratos gubernamentales o suministro a entidades estatales israelíes |
| `produced_in_israel` | Rojo | Fabricado en Israel (territorio reconocido internacionalmente) |
| `produced_in_settlements` | Rojo oscuro | Fabricado en o con recursos de asentamientos en territorio palestino ocupado (clasificados como ilegales por el derecho internacional) |

### Criterios de inclusión

Un producto o empresa solo puede tener un nivel de vínculo superior a `none` si:

1. **Existe una fuente verificable** (campo `source_id` obligatorio en tabla `relationships`).
2. La fuente es **pública y consultable** (URL accesible).
3. La información se ha **verificado en la fecha indicada** en `verified_at`.

**Regla de oro**: Sin fuente → no se publica.

### Fuentes utilizadas

| Fuente | Tipo | URL |
|--------|------|-----|
| UN OHCHR Business Enterprise Database | Institucional / ONU | https://www.ohchr.org/en/hr-bodies/hrc/other-issues/business-and-settlements |
| Who Profits Research Center | ONG de investigación | https://whoprofits.org |
| BDS Movement Campaigns | Campañas documentadas | https://bdsmovement.net/act-now/campaigns |
| Open Food Facts | Base de datos abierta | https://world.openfoodfacts.org |
| Reuters Corporate Research | Periodismo verificado | https://www.reuters.com |

### Distinción de tipos de vínculo

Es fundamental **no agregar** vínculos distintos como si fueran equivalentes:

- "Fabricado en Tel Aviv" ≠ "empresa matriz con oficina comercial en Israel".
- "Suministra tecnología a gobierno israelí" ≠ "produce en asentamientos".
- La tabla `relationships` permite múltiples vínculos por producto, cada uno con su propio tipo y fuente.

### Proceso de moderación

1. **Reporte comunitario** → estado `pending`.
2. **Revisión por moderador** → comprobación de fuente y descripción.
3. **Aprobación** → se actualiza el producto en la base de datos.
4. **Rechazo** → notificación al usuario con motivo.

### Política de disputas

Las empresas afectadas pueden solicitar revisión enviando una solicitud a `POST /api/dispute` con nombre de empresa, email de contacto, descripción y documentación acreditativa. Plazo de revisión: 30 días hábiles.

---

## Consideraciones legales

> **AVISO LEGAL**: La información proporcionada por VerifEye tiene fines exclusivamente informativos para la toma de decisiones personales del consumidor. No constituye asesoría legal ni llamada al boicot de ningún producto, empresa o país.

### Jurisdicciones con restricciones relevantes

- **Alemania**: La ley prohíbe ciertos llamamientos explícitos al boicot. VerifEye no hace llamamientos al boicot.
- **Varios estados de EE.UU.**: Leyes anti-BDS en más de 30 estados. Revisar regulación local antes de desplegar.
- **Francia**: Condenas previas por distribución de material que llamaba al boicot de productos israelíes.

VerifEye proporciona **datos**, no directivas de comportamiento.

### GDPR

- Las consultas no se asocian a usuarios identificados salvo consentimiento explícito.
- Los reportes comunitarios pueden asociarse a un `user_id` solo con sesión iniciada voluntariamente.
- No se transmiten datos de usuario a terceros.
