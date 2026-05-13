import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCategoria,
  deleteCategoria,
  getCategorias,
  updateCategoria,
} from '@/lib/api'

export function useCategorias() {
  return useQuery({ queryKey: ['categorias'], queryFn: getCategorias })
}

export function useCreateCategoria() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createCategoria,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias'] }),
  })
}

export function useUpdateCategoria() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { nombre?: string; descripcion?: string } }) =>
      updateCategoria(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias'] }),
  })
}

export function useDeleteCategoria() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias'] }),
  })
}
