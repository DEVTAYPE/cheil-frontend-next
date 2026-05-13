import { useTransition, useState } from 'react'
import { toast } from 'sonner'
import { useCategorias } from '@/hooks/useCategorias'
import { useDeleteProducto, useProductos } from '@/hooks/useProductos'
import type { ListProductosParams } from '@/lib/types'

export function useProductosPage() {
  const [params, setParams] = useState<ListProductosParams>({ page: 1, limit: 10 })
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [isNavigating, startNavigation] = useTransition()

  const { data, isLoading, isError, error } = useProductos(params)
  const { data: categorias = [] } = useCategorias()
  const deleteMutation = useDeleteProducto()

  const applyFilter = (f: ListProductosParams) =>
    startNavigation(() => setParams((p) => ({ ...p, ...f, page: 1 })))

  const clearFilter = () =>
    startNavigation(() => setParams({ page: 1, limit: 10 }))

  const goToPrevPage = () =>
    startNavigation(() => setParams((p) => ({ ...p, page: (p.page ?? 1) - 1 })))

  const goToNextPage = () =>
    startNavigation(() => setParams((p) => ({ ...p, page: (p.page ?? 1) + 1 })))

  const requestDelete = (id: number) => setConfirmDeleteId(id)
  const cancelDelete = () => setConfirmDeleteId(null)

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
      cancelDelete()
      toast.success('Producto eliminado correctamente')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar el producto')
    }
  }

  return {
    data,
    isLoading,
    isError,
    error,
    isNavigating,
    categorias,
    confirmDeleteId,
    isDeleting: deleteMutation.isPending,
    applyFilter,
    clearFilter,
    goToPrevPage,
    goToNextPage,
    requestDelete,
    cancelDelete,
    handleDelete,
  }
}
