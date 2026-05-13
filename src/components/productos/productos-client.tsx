'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { useProductosPage } from './hooks/use-productos-page'
import { FiltrosProductos } from './organisms/filtros-productos'
import { ProductosTable } from './organisms/productos-table'
import { ConfirmDeleteModal } from './molecules/confirm-delete-modal'

function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
      {message}
    </div>
  )
}

function PlusIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}

export function ProductosClient() {
  const {
    data,
    isLoading,
    isError,
    error,
    isNavigating,
    categorias,
    confirmDeleteId,
    isDeleting,
    applyFilter,
    clearFilter,
    goToPrevPage,
    goToNextPage,
    requestDelete,
    cancelDelete,
    handleDelete,
  } = useProductosPage()

  const productName = useMemo(
    () => data?.items.find((p) => p.id === confirmDeleteId)?.nombre ?? '',
    [data?.items, confirmDeleteId],
  )

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
            <PlusIcon />
            Nuevo producto
          </Button>
        </Link>
      </div>

      <FiltrosProductos
        categorias={categorias}
        onFilter={applyFilter}
        onClear={clearFilter}
      />

      {isLoading && <Spinner />}

      {isError && (
        <ErrorBanner
          message={error instanceof Error ? error.message : 'Error al cargar productos'}
        />
      )}

      {data && (
        <div className={isNavigating ? 'pointer-events-none opacity-60 transition-opacity' : ''}>
          <ProductosTable
            items={data.items}
            page={data.page}
            lastPage={data.lastPage}
            total={data.total}
            onRequestDelete={requestDelete}
            onPrevPage={goToPrevPage}
            onNextPage={goToNextPage}
          />
        </div>
      )}

      <ConfirmDeleteModal
        open={confirmDeleteId !== null}
        productName={productName}
        isDeleting={isDeleting}
        onConfirm={() => confirmDeleteId !== null && handleDelete(confirmDeleteId)}
        onCancel={cancelDelete}
      />
    </div>
  )
}
