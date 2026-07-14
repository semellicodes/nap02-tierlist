export function authHeaders(accessToken) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  }
}

export async function parseOrThrow(res, mensagemErro) {
  if (!res.ok) throw new Error(mensagemErro)
  return res.status === 204 ? null : res.json()
}
