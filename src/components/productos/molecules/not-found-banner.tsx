import Link from 'next/link'

interface NotFoundBannerProps {
  title?: string
  message?: string
  backHref: string
  backLabel?: string
}

export function NotFoundBanner({
  title = 'No encontrado',
  message,
  backHref,
  backLabel = '← Volver',
}: NotFoundBannerProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
        <p className="text-lg font-semibold text-red-700">{title}</p>
        {message && <p className="mt-1 text-sm text-red-500">{message}</p>}
        <Link
          href={backHref}
          className="mt-4 inline-block text-sm text-red-600 underline hover:text-red-800"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  )
}
