# Abel de Ferro — Plataforma de Libros

Portal oficial de libros de **Abel de Ferro**. Plataforma completa para descubrir, comprar y leer las obras del autor.

## Características

- 🌐 Landing page con presentación del autor y libros destacados
- 📚 Catálogo con página detallada de cada libro (estilo Amazon)
- 🔐 Autenticación con **Supabase Auth** (email/password y magic link)
- 💳 Compra de libros con **Stripe Checkout**
- 📖 Lector integrado con texto + audio (Web Speech API)
  - Navegación por páginas
  - Ir a página específica
  - Buscar palabra
  - Control de tamaño de fuente
  - Modo noche/día
  - Progreso guardado automáticamente
- 👤 Área personal (mi cuenta, mi biblioteca)
- 🔗 Sistema de referidos con tracking de comisiones
- 📊 Panel de administración con métricas
- 📱 Optimizado para móvil (620×320 y superior)

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript |
| Estilos | Tailwind CSS v4 + CSS custom (tema oscuro/dorado) |
| Auth | Supabase Auth |
| Base de datos | Supabase (PostgreSQL) |
| Almacenamiento | Supabase Storage |
| Pagos | Stripe Checkout |
| Audio | Web Speech API (nativo) |

## Configuración

### 1. Clonar e instalar

```bash
git clone <repo>
cd abeldeferro
npm install
```

### 2. Variables de entorno

Copia `.env.local.example` a `.env.local` y rellena los valores:

```bash
cp .env.local.example .env.local
```

Variables requeridas:
- **Supabase**: URL y claves del proyecto (ver `supabase.com/dashboard`)
- **Stripe**: Clave secreta, clave pública y webhook secret

### 3. Base de datos

Ejecuta el esquema SQL en tu proyecto Supabase:

```
Supabase Dashboard → SQL Editor → pegar contenido de supabase/schema.sql
```

### 4. Stripe

1. Crea los productos en el dashboard de Stripe
2. Añade los IDs de precio a `.env.local`
3. Configura el webhook apuntando a `/api/webhook`

### 5. Desarrollo

```bash
npm run dev
```

La app estará en `http://localhost:3000`.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Linting |

## Estructura

```
src/
  app/
    page.tsx              # Landing page
    autor/                # Página del autor
    catalogo/             # Catálogo de libros
    libros/[slug]/        # Página de libro (Amazon-style)
    lector/[bookId]/      # Lector integrado
    auth/                 # Login, registro, callback
    mi-cuenta/            # Perfil de usuario
    mi-biblioteca/        # Libros comprados
    admin/                # Panel de administración
    api/
      checkout/           # Stripe checkout session
      webhook/            # Stripe webhook handler
      progress/           # Progreso de lectura
  components/
    Navigation.tsx
    BookCard.tsx
    BookPurchaseSection.tsx
    BookReader.tsx
    StarRating.tsx
  lib/
    books.ts              # Datos estáticos de libros
    supabase.ts           # Cliente Supabase (browser)
    supabase-server.ts    # Cliente Supabase (server)
    stripe.ts             # Cliente Stripe
    types.ts              # TypeScript interfaces
content/
  libro_elimperiotraicionado.md   # Contenido del libro
  libro_sombrasenelespejo.md      # Contenido del libro
supabase/
  schema.sql              # Esquema completo de BD
```

## Referidos

El sistema de referidos funciona via query param `?ref=CODIGO`. El código se persiste durante el flujo de compra y queda registrado en `af_logs` al convertirse.

Para generar un enlace de referido: `https://tudominio.com/catalogo?ref=CODIGO_REFERIDOR`
