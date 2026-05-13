export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
      {message}
    </div>
  )
}
