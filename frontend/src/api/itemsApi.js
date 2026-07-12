const API_URL = import.meta.env.VITE_API_URL

function authHeaders(accessToken) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  }
}

async function parseOrThrow(res, mensagemErro) {
  if (!res.ok) throw new Error(mensagemErro)
  return res.status === 204 ? null : res.json()
}

export function fetchItems(accessToken) {
  return fetch(`${API_URL}/items`, { headers: authHeaders(accessToken) }).then((res) =>
    parseOrThrow(res, 'Não foi possível carregar os itens'),
  )
}

export function createItem(accessToken, item) {
  return fetch(`${API_URL}/items`, {
    method: 'POST',
    headers: authHeaders(accessToken),
    body: JSON.stringify(item),
  }).then((res) => parseOrThrow(res, 'Não foi possível criar o item'))
}

export function updateItemTier(accessToken, itemId, tier) {
  return fetch(`${API_URL}/items/${itemId}`, {
    method: 'PUT',
    headers: authHeaders(accessToken),
    body: JSON.stringify({ tier }),
  }).then((res) => parseOrThrow(res, 'Não foi possível mover o item'))
}

export function deleteItem(accessToken, itemId) {
  return fetch(`${API_URL}/items/${itemId}`, {
    method: 'DELETE',
    headers: authHeaders(accessToken),
  }).then((res) => parseOrThrow(res, 'Não foi possível excluir o item'))
}

export function fetchItemHistory(accessToken, itemId) {
  return fetch(`${API_URL}/items/${itemId}/history`, { headers: authHeaders(accessToken) }).then((res) =>
    parseOrThrow(res, 'Não foi possível carregar o histórico'),
  )
}
