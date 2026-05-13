'use client'

import { useState, type FormEvent } from 'react'
import type { Categoria, ListProductosParams } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

interface FiltrosProductosProps {
  categorias: Categoria[]
  onFilter: (params: ListProductosParams) => void
  onClear: () => void
}

interface PrecioErrors {
  precioMin?: string
  precioMax?: string
}

function validatePrecios(min: string, max: string): PrecioErrors {
  const errors: PrecioErrors = {}
  const minVal = min ? Number(min) : null
  const maxVal = max ? Number(max) : null

  if (minVal !== null && minVal < 0) errors.precioMin = 'No puede ser negativo'
  if (maxVal !== null && maxVal < 0) errors.precioMax = 'No puede ser negativo'
  if (minVal !== null && maxVal !== null && !errors.precioMin && !errors.precioMax) {
    if (maxVal < minVal) errors.precioMax = 'No puede ser menor que el mínimo'
  }

  return errors
}

export function FiltrosProductos({ categorias, onFilter, onClear }: FiltrosProductosProps) {
  const [nombre, setNombre] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const [errors, setErrors] = useState<PrecioErrors>({})

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationErrors = validatePrecios(precioMin, precioMax)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    onFilter({
      nombre: nombre || undefined,
      categoriaId: categoriaId ? Number(categoriaId) : undefined,
      precioMin: precioMin ? Number(precioMin) : undefined,
      precioMax: precioMax ? Number(precioMax) : undefined,
      page: 1,
    })
  }

  const handleClear = () => {
    setNombre('')
    setCategoriaId('')
    setPrecioMin('')
    setPrecioMax('')
    setErrors({})
    onClear()
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder="Buscar por nombre..."
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <Select
          placeholder="Todas las categorías"
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          options={categorias.map((c) => ({ value: c.id, label: c.nombre }))}
        />
        <Input
          type="number"
          placeholder="Precio mínimo"
          value={precioMin}
          error={errors.precioMin}
          onChange={(e) => {
            setPrecioMin(e.target.value)
            if (errors.precioMin) setErrors((prev) => ({ ...prev, precioMin: undefined }))
          }}
          min={0}
        />
        <Input
          type="number"
          placeholder="Precio máximo"
          value={precioMax}
          error={errors.precioMax}
          onChange={(e) => {
            setPrecioMax(e.target.value)
            if (errors.precioMax) setErrors((prev) => ({ ...prev, precioMax: undefined }))
          }}
          min={0}
        />
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={handleClear}>
          Limpiar
        </Button>
        <Button type="submit" size="sm">
          Buscar
        </Button>
      </div>
    </form>
  )
}
