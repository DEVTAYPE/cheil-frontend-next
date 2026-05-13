'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'

interface ImageUploaderProps {
  nombre: string
  imagenUrl: string | null
  isPending: boolean
  isError: boolean
  error: unknown
  onUpload: (file: File) => void
}

function ImagePreview({ src, alt }: { src: string | null; alt: string }) {
  if (src) {
    return <img src={src} alt={alt} className="h-20 w-20 rounded-xl border border-gray-200 object-cover" />
  }
  return (
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
  )
}

const MAX_SIZE_MB = 5
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

function validateFile(file: File): string | null {
  if (!file.type.startsWith('image/')) return 'Solo se permiten archivos de imagen'
  if (file.size > MAX_SIZE_BYTES) return `El archivo no puede superar ${MAX_SIZE_MB} MB`
  return null
}

export function ImageUploader({
  nombre,
  imagenUrl,
  isPending,
  isError,
  error,
  onUpload,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const err = validateFile(file)
    if (err) {
      setValidationError(err)
      e.target.value = ''
      return
    }

    setValidationError(null)
    onUpload(file)
  }

  const displayError = validationError ?? (isError ? (error instanceof Error ? error.message : 'Error al subir imagen') : null)

  return (
    <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-6">
      <ImagePreview src={imagenUrl} alt={nombre} />
      <div>
        <p className="text-sm font-medium text-gray-700">Imagen del producto</p>
        <p className="text-xs text-gray-400">PNG, JPG, WEBP · máx. {MAX_SIZE_MB} MB</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
        <Button
          variant="secondary"
          size="sm"
          loading={isPending}
          onClick={() => fileInputRef.current?.click()}
          className="mt-2"
        >
          {imagenUrl ? 'Cambiar imagen' : 'Subir imagen'}
        </Button>
        {displayError && (
          <p className="mt-1 text-xs text-red-600">{displayError}</p>
        )}
      </div>
    </div>
  )
}
