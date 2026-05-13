'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useEditarProductoPage } from './hooks/use-editar-producto-page'
import { NotFoundBanner } from './molecules/not-found-banner'
import { ImageUploader } from './organisms/image-uploader'
import { ProductoForm } from './organisms/producto-form'

function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  )
}

export function EditarProductoClient() {
  const { id: idParam } = useParams()
  const id = Number(idParam)

  const {
    producto,
    categorias,
    isLoading,
    isError,
    error,
    uploadMutation,
    handleUpdate,
    handleImageUpload,
  } = useEditarProductoPage(id)

  if (isLoading) return <Spinner />

  if (isError || !producto) {
    return (
      <NotFoundBanner
        title="Producto no encontrado"
        message={error instanceof Error ? error.message : undefined}
        backHref="/productos"
        backLabel="← Volver a productos"
      />
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/productos">
          <Button variant="ghost" size="sm">
            ← Volver
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Editar producto</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <ImageUploader
          nombre={producto.nombre}
          imagenUrl={producto.imagenUrl}
          isPending={uploadMutation.isPending}
          isError={uploadMutation.isError}
          error={uploadMutation.error}
          onUpload={handleImageUpload}
        />

        <ProductoForm
          defaultValues={{
            nombre: producto.nombre,
            descripcion: producto.descripcion ?? '',
            precio: producto.precio,
            stock: producto.stock,
            categoriaId: producto.categoria.id,
          }}
          categorias={categorias}
          onSubmit={handleUpdate}
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  )
}
