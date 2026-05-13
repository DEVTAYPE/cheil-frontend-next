const TOKEN_COOKIE = 'cheil_token'

export function getToken(): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${TOKEN_COOKIE}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null
  return null
}

export function setToken(token: string): void {
  document.cookie = `${TOKEN_COOKIE}=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
}

export function removeToken(): void {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}

export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (data.success) {
      setToken(data.data.access_token)
      return { success: true }
    }
    return { success: false, message: data.message ?? 'Credenciales inválidas' }
  } catch {
    return { success: false, message: 'Error de conexión con el servidor' }
  }
}

export function logout(): void {
  removeToken()
}
