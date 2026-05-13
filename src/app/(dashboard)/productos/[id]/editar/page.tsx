'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useRef } from 'react'
import { useCategorias } from '@/hooks/useCategorias'
import { useProducto, useUpdateProducto, useUploadImagen } from '@/hooks/useProductos'
import type { ProductoInput } from '@/lib/schemas'
import { Button } from '@/components/ui/Button'
import { ProductoForm } from '@/components/productos/ProductoForm'

export default function EditarProductoPage() {
  const { id: idParam } = useParams()
  const id = Number(idParam)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: producto, isLoading } = useProducto(id)
  const { data: categorias = [] } = useCategorias()
  const updateMutation = useUpdateProducto()
  const uploadMutation = useUploadImagen()

  const handleUpdate = async (data: ProductoInput) => {
    try {
      await updateMutation.mutateAsync({ id, data })
      router.push('/productos')
    } catch {
      // error shown via updateMutation.isError
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await uploadMutation.mutateAsync({ id, file })
    } catch {
      // error shown via uploadMutation.isError
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (!producto) return null

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
        <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-6">
          {producto.imagenUrl ? (
            <img
              src={producto.imagenUrl}
              alt={producto.nombre}
              className="h-20 w-20 rounded-xl border border-gray-200 object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-100">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-700">Imagen del producto</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <Button
              variant="secondary"
              size="sm"
              loading={uploadMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
              className="mt-2"
            >
              {producto.imagenUrl ? 'Cambiar imagen' : 'Subir imagen'}
            </Button>
            {uploadMutation.isError && (
              <p className="mt-1 text-xs text-red-600">
                {uploadMutation.error instanceof Error
                  ? uploadMutation.error.message
                  : 'Error al subir imagen'}
              </p>
            )}
          </div>
        </div>

        {updateMutation.isError && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {updateMutation.error instanceof Error
              ? updateMutation.error.message
              : 'Error al actualizar'}
          </div>
        )}

        <ProductoForm
          defaultValues={{
            nombre: producto.nombre,
            descripcion: producto.descripcion ?? '',
            precio: producto.precio,
            stock: producto.stock,
            categoriaId: producto.categoriaId,
          }}
          categorias={categorias}
          onSubmit={handleUpdate}
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  )
}
