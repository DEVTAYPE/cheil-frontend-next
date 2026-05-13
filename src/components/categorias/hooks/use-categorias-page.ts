import { useState } from 'react'
import { toast } from 'sonner'
import {
  useCategorias,
  useCreateCategoria,
  useDeleteCategoria,
  useUpdateCategoria,
} from '@/hooks/useCategorias'
import type { Categoria } from '@/lib/types'
import type { CategoriaInput } from '@/lib/schemas'

export type ModalMode = { type: 'create' } | { type: 'edit'; categoria: Categoria } | null

export function useCategoriasPage() {
  const [modal, setModal] = useState<ModalMode>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const { data: categorias = [], isLoading, isError } = useCategorias()
  const createMutation = useCreateCategoria()
  const updateMutation = useUpdateCategoria()
  const deleteMutation = useDeleteCategoria()

  const openCreate = () => setModal({ type: 'create' })
  const openEdit = (categoria: Categoria) => setModal({ type: 'edit', categoria })
  const closeModal = () => setModal(null)
  const requestDelete = (id: number) => setConfirmDeleteId(id)
  const cancelDelete = () => setConfirmDeleteId(null)

  const handleCreate = async (data: CategoriaInput) => {
    try {
      await createMutation.mutateAsync(data)
      closeModal()
    } catch {
      // error handled by mutation state
    }
  }

  const handleEdit = async (data: CategoriaInput) => {
    if (modal?.type !== 'edit') return
    try {
      await updateMutation.mutateAsync({ id: modal.categoria.id, data })
      closeModal()
    } catch {
      // error handled by mutation state
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
      cancelDelete()
      toast.success('Categoría eliminada correctamente')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar la categoría')
    }
  }

  return {
    categorias,
    isLoading,
    isError,
    modal,
    confirmDeleteId,
    isDeleting: deleteMutation.isPending,
    openCreate,
    openEdit,
    closeModal,
    requestDelete,
    cancelDelete,
    handleCreate,
    handleEdit,
    handleDelete,
  }
}
