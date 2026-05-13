import type { Producto } from '@/lib/types'
import { PaginationBar } from '../molecules/pagination-bar'
import { ProductoRow } from './producto-row'

const TABLE_HEADERS = ['#', 'Imagen', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Acciones']

interface ProductosTableProps {
  items: Producto[]
  page: number
  lastPage: number
  total: number
  confirmDeleteId: number | null
  isDeleting: boolean
  onRequestDelete: (id: number) => void
  onConfirmDelete: (id: number) => void
  onCancelDelete: () => void
  onPrevPage: () => void
  onNextPage: () => void
}

export function ProductosTable({
  items,
  page,
  lastPage,
  total,
  confirmDeleteId,
  isDeleting,
  onRequestDelete,
  onConfirmDelete,
  onCancelDelete,
  onPrevPage,
  onNextPage,
}: ProductosTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {TABLE_HEADERS.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {items.length === 0 ? (
            <tr>
              <td colSpan={TABLE_HEADERS.length} className="py-12 text-center text-gray-400">
                No se encontraron productos
              </td>
            </tr>
          ) : (
            items.map((producto) => (
              <ProductoRow
                key={producto.id}
                producto={producto}
                isConfirmingDelete={confirmDeleteId === producto.id}
                isDeleting={isDeleting}
                onRequestDelete={() => onRequestDelete(producto.id)}
                onConfirmDelete={() => onConfirmDelete(producto.id)}
                onCancelDelete={onCancelDelete}
              />
            ))
          )}
        </tbody>
      </table>

      {lastPage > 1 && (
        <PaginationBar
          page={page}
          lastPage={lastPage}
          total={total}
          onPrev={onPrevPage}
          onNext={onNextPage}
        />
      )}
    </div>
  )
}
