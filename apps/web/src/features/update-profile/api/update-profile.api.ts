const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export interface UpdateProfileData {
  name?: string
  email?: string
}

export interface UpdateProfileResult {
  id: string
  name: string
  email: string
}

export async function updateProfileApi(
  data: UpdateProfileData,
  accessToken: string,
): Promise<UpdateProfileResult> {
  const res = await fetch(`${API_URL}/api/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const msg = Array.isArray(body.message) ? body.message[0] : body.message
    throw new Error(msg ?? 'Failed to update profile')
  }

  return res.json()
}
