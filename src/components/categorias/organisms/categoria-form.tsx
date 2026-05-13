'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { categoriaSchema, type CategoriaInput } from '@/lib/schemas'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { TextareaField } from '../molecules/textarea-field'

interface CategoriaFormProps {
  defaultValues?: Partial<CategoriaInput>
  onSubmit: (data: CategoriaInput) => Promise<void>
  submitLabel: string
}

export function CategoriaForm({ defaultValues, onSubmit, submitLabel }: CategoriaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoriaInput>({
    resolver: zodResolver(categoriaSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Nombre" error={errors.nombre?.message} {...register('nombre')} />
      <TextareaField
        label="Descripción"
        error={errors.descripcion?.message}
        {...register('descripcion')}
      />
      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
