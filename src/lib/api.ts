import type { Categoria, ListProductosParams, PaginatedResult, Producto } from './types'

const BASE = '/api/proxy'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      ...(!(init?.body instanceof FormData) && { 'Content-Type': 'application/json' }),
      ...init?.headers,
    },
  })

  if (res.status === 401) {
    await fetch('/api/auth/logout', { method: 'POST' })
    if (typeof window !== 'undefined') window.location.replace('/login')
    throw new Error('Sesión expirada')
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T
  }

  const json = await res.json()
  if (!json.success) throw new Error(json.message ?? 'Error en la solicitud')
  return json.data as T
}

// ─── Categorías ───────────────────────────────────────────────────────────────

export const getCategorias = (): Promise<Categoria[]> => request('/categorias')

export const getCategoria = (id: number): Promise<Categoria> => request(`/categorias/${id}`)

export const createCategoria = (data: {
  nombre: string
  descripcion?: string
}): Promise<Categoria> => request('/categorias', { method: 'POST', body: JSON.stringify(data) })

export const updateCategoria = (
  id: number,
  data: { nombre?: string; descripcion?: string },
): Promise<Categoria> =>
  request(`/categorias/${id}`, { method: 'PATCH', body: JSON.stringify(data) })

export const deleteCategoria = (id: number): Promise<void> =>
  request(`/categorias/${id}`, { method: 'DELETE' })

// ─── Productos ────────────────────────────────────────────────────────────────

export function getProductos(
  params: ListProductosParams = {},
): Promise<PaginatedResult<Producto>> {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== null) qs.set(k, String(v))
  })
  const query = qs.toString()
  return request(`/productos${query ? `?${query}` : ''}`)
}

export const getProducto = (id: number): Promise<Producto> => request(`/productos/${id}`)

export const createProducto = (data: {
  nombre: string
  descripcion?: string
  precio: number
  stock: number
  categoriaId: number
}): Promise<Producto> => request('/productos', { method: 'POST', body: JSON.stringify(data) })

export const updateProducto = (
  id: number,
  data: {
    nombre?: string
    descripcion?: string
    precio?: number
    stock?: number
    categoriaId?: number
  },
): Promise<Producto> =>
  request(`/productos/${id}`, { method: 'PATCH', body: JSON.stringify(data) })

export const deleteProducto = (id: number): Promise<void> =>
  request(`/productos/${id}`, { method: 'DELETE' })

export function uploadImagen(id: number, file: File): Promise<Producto> {
  const formData = new FormData()
  formData.append('file', file)
  return request(`/productos/${id}/imagen`, { method: 'POST', body: formData })
}
