export interface Categoria {
  id: number
  nombre: string
  descripcion: string | null
  createdAt: string
  updatedAt: string
}

export interface Producto {
  id: number
  nombre: string
  descripcion: string | null
  precio: number
  stock: number
  imagenUrl: string | null
  categoria: { id: number; nombre: string }
  createdAt: string
  updatedAt: string
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  lastPage: number
  limit: number
}

export interface ListProductosParams {
  page?: number
  limit?: number
  nombre?: string
  categoriaId?: number
  precioMin?: number
  precioMax?: number
}
