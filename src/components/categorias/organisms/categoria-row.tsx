import type { Categoria } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { DeleteActions } from '../molecules/delete-actions'

interface CategoriaRowProps {
  categoria: Categoria
  isConfirmingDelete: boolean
  isDeleting: boolean
  onEdit: () => void
  onRequestDelete: () => void
  onConfirmDelete: () => void
  onCancelDelete: () => void
}

export function CategoriaRow({
  categoria,
  isConfirmingDelete,
  isDeleting,
  onEdit,
  onRequestDelete,
  onConfirmDelete,
  onCancelDelete,
}: CategoriaRowProps) {
  return (
    <tr className="transition-colors hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-500">{categoria.id}</td>
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{categoria.nombre}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{categoria.descripcion ?? '—'}</td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={onEdit}>
            Editar
          </Button>
          <DeleteActions
            isConfirming={isConfirmingDelete}
            isDeleting={isDeleting}
            onRequest={onRequestDelete}
            onConfirm={onConfirmDelete}
            onCancel={onCancelDelete}
          />
        </div>
      </td>
    </tr>
  )
}
