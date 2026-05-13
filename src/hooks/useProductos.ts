import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createProducto,
  deleteProducto,
  getProducto,
  getProductos,
  updateProducto,
  uploadImagen,
} from '@/lib/api'
import type { ListProductosParams } from '@/lib/types'

export function useProductos(params: ListProductosParams = {}) {
  return useQuery({
    queryKey: ['productos', params],
    queryFn: () => getProductos(params),
  })
}

export function useProducto(id: number) {
  return useQuery({
    queryKey: ['productos', id],
    queryFn: () => getProducto(id),
    enabled: id > 0,
  })
}

export function useCreateProducto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createProducto,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['productos'] }),
  })
}

export function useUpdateProducto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Parameters<typeof updateProducto>[1]
    }) => updateProducto(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['productos'] }),
  })
}

export function useDeleteProducto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['productos'] }),
  })
}

export function useUploadImagen() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => uploadImagen(id, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['productos'] }),
  })
}
