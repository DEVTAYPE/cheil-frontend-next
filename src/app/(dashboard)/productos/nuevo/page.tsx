'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCategorias } from '@/hooks/useCategorias'
import { useCreateProducto } from '@/hooks/useProductos'
import type { ProductoInput } from '@/lib/schemas'
import { Button } from '@/components/ui/Button'
import { ProductoForm } from '@/components/productos/organisms/producto-form'

export default function NuevoProductoPage() {
  const router = useRouter()
  const { data: categorias = [] } = useCategorias()
  const createMutation = useCreateProducto()

  const handleSubmit = async (data: ProductoInput) => {
    try {
      await createMutation.mutateAsync(data)
      router.push('/productos')
    } catch {
      // error shown via createMutation.isError
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/productos">
          <Button variant="ghost" size="sm">
            ← Volver
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo producto</h1>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        {createMutation.isError && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {createMutation.error instanceof Error
              ? createMutation.error.message
              : 'Error al crear el producto'}
          </div>
        )}
        <ProductoForm
          categorias={categorias}
          onSubmit={handleSubmit}
          submitLabel="Crear producto"
        />
      </div>
    </div>
  )
}
