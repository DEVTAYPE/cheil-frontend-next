function ImagePlaceholder() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

export function ProductImage({ src, alt }: { src: string | null; alt: string }) {
  if (!src) return <ImagePlaceholder />

  return <img src={src} alt={alt} className="h-10 w-10 rounded-lg object-cover" />
}
