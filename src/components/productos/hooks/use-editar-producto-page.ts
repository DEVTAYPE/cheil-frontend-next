import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useCategorias } from '@/hooks/useCategorias'
import { useProducto, useUpdateProducto, useUploadImagen } from '@/hooks/useProductos'
import type { ProductoInput } from '@/lib/schemas'

export function useEditarProductoPage(id: number) {
  const router = useRouter()

  const { data: producto, isLoading: isLoadingProducto, isError, error } = useProducto(id)
  const { data: categorias = [], isLoading: isLoadingCategorias } = useCategorias()
  const updateMutation = useUpdateProducto()
  const uploadMutation = useUploadImagen()

  const handleUpdate = async (data: ProductoInput) => {
    try {
      await updateMutation.mutateAsync({ id, data })
      toast.success('Producto actualizado correctamente')
      router.push('/productos')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al actualizar el producto')
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      await uploadMutation.mutateAsync({ id, file })
      toast.success('Imagen actualizada correctamente')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al subir la imagen')
    }
  }

  return {
    producto,
    categorias,
    isLoading: isLoadingProducto || isLoadingCategorias,
    isError,
    error,
    uploadMutation,
    handleUpdate,
    handleImageUpload,
  }
}
