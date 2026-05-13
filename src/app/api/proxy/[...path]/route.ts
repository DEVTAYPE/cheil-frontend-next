import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const BACKEND = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`

async function proxy(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('cheil_token')?.value

  const backendUrl = `${BACKEND}/${path.join('/')}${req.nextUrl.search}`

  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  const contentType = req.headers.get('content-type')
  if (contentType) headers['Content-Type'] = contentType

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD'
  const body = hasBody ? await req.arrayBuffer() : undefined

  try {
    const backendRes = await fetch(backendUrl, {
      method: req.method,
      headers,
      body: body && body.byteLength > 0 ? body : undefined,
    })

    if (backendRes.status === 204) {
      return new NextResponse(null, { status: 204 })
    }

    const text = await backendRes.text()
    return new NextResponse(text, {
      status: backendRes.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Error de conexión con el servidor' },
      { status: 503 },
    )
  }
}

export const GET = proxy
export const POST = proxy
export const PATCH = proxy
export const DELETE = proxy
export const PUT = proxy
