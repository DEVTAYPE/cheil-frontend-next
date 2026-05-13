import { Button } from '@/components/ui/Button'

interface DeleteActionsProps {
  isConfirming: boolean
  isDeleting: boolean
  onRequest: () => void
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteActions({
  isConfirming,
  isDeleting,
  onRequest,
  onConfirm,
  onCancel,
}: DeleteActionsProps) {
  if (isConfirming) {
    return (
      <div className="flex gap-1">
        <Button variant="danger" size="sm" loading={isDeleting} onClick={onConfirm}>
          Confirmar
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-red-500 hover:bg-red-50 hover:text-red-700"
      onClick={onRequest}
    >
      Eliminar
    </Button>
  )
}
