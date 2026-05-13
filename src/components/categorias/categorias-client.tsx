'use client'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useCategoriasPage } from './hooks/use-categorias-page'
import { Spinner } from './atoms/spinner'
import { PlusIcon } from './atoms/plus-icon'
import { ErrorBanner } from './molecules/error-banner'
import { ConfirmDeleteModal } from './molecules/confirm-delete-modal'
import { CategoriaTable } from './organisms/categoria-table'
import { CategoriaForm } from './organisms/categoria-form'

export function CategoriasClient() {
  const {
    categorias,
    isLoading,
    isError,
    modal,
    confirmDeleteId,
    isDeleting,
    openCreate,
    openEdit,
    closeModal,
    requestDelete,
    cancelDelete,
    handleCreate,
    handleEdit,
    handleDelete,
  } = useCategoriasPage()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <p className="mt-1 text-sm text-gray-500">{categorias.length} categorías registradas</p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon />
          Nueva categoría
        </Button>
      </div>

      {isLoading && <Spinner />}
      {isError && <ErrorBanner message="Error al cargar categorías" />}

      {!isLoading && (
        <CategoriaTable
          categorias={categorias}
          onEdit={openEdit}
          onRequestDelete={requestDelete}
        />
      )}

      <ConfirmDeleteModal
        open={confirmDeleteId !== null}
        categoryName={categorias.find((c) => c.id === confirmDeleteId)?.nombre ?? ''}
        isDeleting={isDeleting}
        onConfirm={() => confirmDeleteId !== null && handleDelete(confirmDeleteId)}
        onCancel={cancelDelete}
      />

      <Modal
        open={modal !== null}
        onClose={closeModal}
        title={modal?.type === 'create' ? 'Nueva categoría' : 'Editar categoría'}
      >
        {modal?.type === 'create' && (
          <CategoriaForm onSubmit={handleCreate} submitLabel="Crear categoría" />
        )}
        {modal?.type === 'edit' && (
          <CategoriaForm
            defaultValues={{
              nombre: modal.categoria.nombre,
              descripcion: modal.categoria.descripcion ?? '',
            }}
            onSubmit={handleEdit}
            submitLabel="Guardar cambios"
          />
        )}
      </Modal>
    </div>
  )
}
