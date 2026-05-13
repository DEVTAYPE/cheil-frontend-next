export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    return data.success
      ? { success: true }
      : { success: false, message: data.message ?? 'Credenciales inválidas' }
  } catch {
    return { success: false, message: 'Error de conexión con el servidor' }
  }
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' })
}
