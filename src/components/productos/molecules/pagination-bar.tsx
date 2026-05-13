import { Button } from '@/components/ui/Button'

interface PaginationBarProps {
  page: number
  lastPage: number
  total: number
  onPrev: () => void
  onNext: () => void
}

export function PaginationBar({ page, lastPage, total, onPrev, onNext }: PaginationBarProps) {
  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
      <p className="text-sm text-gray-500">
        Página {page} de {lastPage} — {total} resultados
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={onPrev}>
          Anterior
        </Button>
        <Button variant="secondary" size="sm" disabled={page >= lastPage} onClick={onNext}>
          Siguiente
        </Button>
      </div>
    </div>
  )
}
