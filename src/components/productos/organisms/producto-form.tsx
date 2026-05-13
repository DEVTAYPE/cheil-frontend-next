'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { Categoria } from '@/lib/types'
import { productoSchema, type ProductoInput } from '@/lib/schemas'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

interface ProductoFormProps {
  defaultValues?: Partial<ProductoInput>
  categorias: Categoria[]
  onSubmit: (data: ProductoInput) => Promise<void>
  submitLabel?: string
}

export function ProductoForm({
  defaultValues,
  categorias,
  onSubmit,
  submitLabel = 'Guardar',
}: ProductoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductoInput>({
    resolver: zodResolver(productoSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input label="Nombre" error={errors.nombre?.message} {...register('nombre')} />
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          {...register('descripcion')}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Precio (S/)"
          type="number"
          step="0.01"
          min="0"
          error={errors.precio?.message}
          {...register('precio', { valueAsNumber: true })}
        />
        <Input
          label="Stock"
          type="number"
          min="0"
          error={errors.stock?.message}
          {...register('stock', { valueAsNumber: true })}
        />
      </div>
      <Select
        label="Categoría"
        placeholder="Selecciona una categoría"
        error={errors.categoriaId?.message}
        options={categorias.map((c) => ({ value: c.id, label: c.nombre }))}
        {...register('categoriaId', {
          setValueAs: (v: string) => (v === '' ? 0 : Number(v)),
        })}
      />
      <div className="flex justify-end pt-2">
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
