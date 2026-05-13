'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCategorias } from '@/hooks/useCategorias'
import { useDeleteProducto, useProductos } from '@/hooks/useProductos'
import type { ListProductosParams } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { FiltrosProductos } from './FiltrosProductos'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(price)

export function ProductosClient() {
  const [params, setParams] = useState<ListProductosParams>({ page: 1, limit: 10 })
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const { data, isLoading, isError, error } = useProductos(params)
  const { data: categorias = [] } = useCategorias()
  const deleteMutation = useDeleteProducto()

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
      setConfirmDeleteId(null)
    } catch {
      // error shown via deleteMutation.isError
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          {data && (
            <p className="mt-1 text-sm text-gray-500">{data.total} productos en total</p>
          )}
        </div>
        <Link href="/productos/nuevo">
          <Button>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nuevo producto
          </Button>
        </Link>
      </div>

      <FiltrosProductos
        categorias={categorias}
        onFilter={(f) => setParams((p) => ({ ...p, ...f, page: 1 }))}
        onClear={() => setParams({ page: 1, limit: 10 })}
      />

      {isLoading && (
        <div className="flex justify-center py-12">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
          {error instanceof Error ? error.message : 'Error al cargar productos'}
        </div>
      )}

      {data && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['#', 'Imagen', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Acciones'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {data.items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                data.items.map((producto) => (
                  <tr key={producto.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">{producto.id}</td>
                    <td className="px-4 py-3">
                      {producto.imagenUrl ? (
                        <img
                          src={producto.imagenUrl}
                          alt={producto.nombre}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{producto.nombre}</p>
                      {producto.descripcion && (
                        <p className="max-w-48 truncate text-xs text-gray-400">
                          {producto.descripcion}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="blue">{producto.categoria.nombre}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {formatPrice(producto.precio)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={producto.stock > 0 ? 'green' : 'red'}>
                        {producto.stock}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/productos/${producto.id}/editar`}>
                          <Button variant="secondary" size="sm">
                            Editar
                          </Button>
                        </Link>
                        {confirmDeleteId === producto.id ? (
                          <div className="flex gap-1">
                            <Button
                              variant="danger"
                              size="sm"
                              loading={deleteMutation.isPending}
                              onClick={() => handleDelete(producto.id)}
                            >
                              Confirmar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setConfirmDeleteId(null)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:bg-red-50 hover:text-red-700"
                            onClick={() => setConfirmDeleteId(producto.id)}
                          >
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {data.lastPage > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
              <p className="text-sm text-gray-500">
                Página {data.page} de {data.lastPage} — {data.total} resultados
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={data.page <= 1}
                  onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
                >
                  Anterior
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={data.page >= data.lastPage}
                  onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
