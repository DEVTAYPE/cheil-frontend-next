# Cheil Perú — Panel de Administración

Panel web para gestión de productos y categorías construido con Next.js 16 y React 19.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS |
| Estado servidor | TanStack Query v5 |
| Formularios | React Hook Form + Zod |
| Notificaciones | Sonner |

---

## Levantar el proyecto

```bash
# 1. Instalar dependencias
pnpm install

# 2. Variables de entorno
cp .env.example .env.local
# Editar .env.local

# 3. Desarrollo
pnpm dev
```

### Variables de entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:3000   # URL base del backend
```

---

## Autenticación

El token JWT se almacena en una **cookie HttpOnly** — completamente invisible para JavaScript del browser. Esto previene robo de tokens por XSS.

**Flujo de login:**

```
Cliente → POST /api/auth/login (Next.js route handler)
        → Llama al backend con las credenciales
        → Setea la cookie HttpOnly desde el servidor
        → El token nunca toca el cliente
```

**Flujo de peticiones autenticadas:**

```
Cliente → GET /api/proxy/productos (Next.js proxy)
        → Lee la cookie HttpOnly server-side
        → Reenvía al backend con Authorization: Bearer <token>
        → Retorna la respuesta al cliente
```

**Protección de rutas:** El middleware `src/middleware.ts` intercepta todas las rutas del dashboard. Si no existe la cookie redirige a `/login`. Si hay sesión activa e intenta entrar a `/login`, redirige a `/productos`.

**Archivos clave de auth:**

```
src/app/api/auth/login/route.ts      — setea cookie HttpOnly
src/app/api/auth/logout/route.ts     — borra la cookie
src/app/api/proxy/[...path]/route.ts — proxy que inyecta el token
src/middleware.ts                    — guard de rutas
src/lib/auth.ts                      — login() y logout() del cliente
src/lib/api.ts                       — cliente HTTP (apunta a /api/proxy)
```

---

## Estructura del proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          — rutas de login y logout
│   │   └── proxy/         — proxy autenticado hacia el backend
│   ├── (auth)/login/      — página de inicio de sesión
│   └── (dashboard)/       — rutas protegidas por middleware
│       ├── productos/      — listado, crear y editar
│       └── categorias/     — CRUD completo
├── components/
│   ├── ui/                — componentes base (Button, Input, Select, Modal, Badge)
│   ├── productos/         — módulo productos (atomic design)
│   ├── categorias/        — módulo categorías (atomic design)
│   ├── layout/            — Navbar
│   └── providers/         — QueryProvider
├── hooks/                 — useProductos, useCategorias
├── lib/
│   ├── api.ts             — cliente HTTP centralizado
│   ├── auth.ts            — funciones de autenticación
│   ├── schemas.ts         — validaciones Zod
│   └── types.ts           — interfaces TypeScript
└── middleware.ts
```

### Atomic design por módulo

Cada módulo (`productos/`, `categorias/`) tiene la misma estructura interna:

```
módulo/
├── atoms/        — elementos mínimos: íconos, spinner
├── molecules/    — combinaciones simples: DeleteActions, PaginationBar, ConfirmDeleteModal
├── organisms/    — secciones completas: Table, Form, Filters, ImageUploader
├── hooks/        — lógica de negocio separada de la UI
└── *-client.tsx  — template: solo composición, sin lógica directa
```

El `page.tsx` de cada ruta es un wrapper de una línea que renderiza el template correspondiente.

---

## Módulos

### Productos (`/productos`)

- **Listado** — tabla paginada con filtros por nombre, categoría y rango de precio. Los datos previos se mantienen visibles al paginar (`keepPreviousData`). Cambios de página y filtros usan `useTransition` para no bloquear la UI.
- **Crear** (`/productos/nuevo`) — formulario validado con Zod.
- **Editar** (`/productos/:id/editar`) — espera que carguen producto y categorías antes de montar el formulario para que el select aparezca pre-seleccionado. Permite subir imagen (solo `image/*`, máx. 5 MB).
- **Eliminar** — modal de confirmación con el nombre del producto.
- **Error 404** — si el ID no existe, muestra un banner con el mensaje del backend.

### Categorías (`/categorias`)

- **Listado** — tabla con todas las categorías registradas.
- **Crear / Editar** — modal con formulario inline.
- **Eliminar** — modal de confirmación con el nombre de la categoría.

---

## Decisiones técnicas

**Cookie HttpOnly**
El token nunca es accesible desde `document.cookie`. Se setea exclusivamente desde el servidor, protegiéndolo de XSS. DevTools → Application → Cookies muestra la cookie con HttpOnly marcado pero sin poder copiar su valor desde JS.

**Proxy en Next.js**
Todas las peticiones al backend pasan por `/api/proxy/[...path]`. El cliente nunca llama directamente al backend — esto centraliza la autenticación y mantiene la URL del backend fuera del bundle público.

**Atomic Design modular**
Cada feature es autocontenida. Los custom hooks separan completamente la lógica de estado del render, haciendo que los templates sean composiciones declarativas sin lógica.

**TanStack Query**
Gestiona caché y revalidación. Al crear, editar o eliminar se invalida la query afectada, refrescando la lista automáticamente sin recarga manual.
