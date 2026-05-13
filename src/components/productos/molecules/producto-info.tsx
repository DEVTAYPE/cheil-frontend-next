export function ProductoInfo({
  nombre,
  descripcion,
}: {
  nombre: string
  descripcion: string | null
}) {
  return (
    <div>
      <p className="font-medium text-gray-900">{nombre}</p>
      {descripcion && (
        <p className="max-w-48 truncate text-xs text-gray-400">{descripcion}</p>
      )}
    </div>
  )
}
