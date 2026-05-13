import { Button } from '@/components/ui/Button'

export function DeleteActions({ onRequest }: { onRequest: () => void }) {
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
