import { NextRequest, NextResponse } from 'next/server'

const BACKEND = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const backendRes = await fetch(`${BACKEND}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await backendRes.json()

    if (!data.success) {
      return NextResponse.json(data, { status: backendRes.status })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('cheil_token', data.data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json(
      { success: false, message: 'Error de conexión con el servidor' },
      { status: 503 },
    )
  }
}
