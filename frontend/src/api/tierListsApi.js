import { authHeaders, parseOrThrow } from './http'

const API_URL = import.meta.env.VITE_API_URL

export function fetchTierLists(accessToken) {
  return fetch(`${API_URL}/tier-lists`, { headers: authHeaders(accessToken) }).then((res) =>
    parseOrThrow(res, 'Não foi possível carregar as listas'),
  )
}

export function createTierList(accessToken, name) {
  return fetch(`${API_URL}/tier-lists`, {
    method: 'POST',
    headers: authHeaders(accessToken),
    body: JSON.stringify({ name }),
  }).then((res) => parseOrThrow(res, 'Não foi possível criar a lista'))
}

export function renameTierList(accessToken, tierListId, name) {
  return fetch(`${API_URL}/tier-lists/${tierListId}`, {
    method: 'PUT',
    headers: authHeaders(accessToken),
    body: JSON.stringify({ name }),
  }).then((res) => parseOrThrow(res, 'Não foi possível renomear a lista'))
}

export function deleteTierList(accessToken, tierListId) {
  return fetch(`${API_URL}/tier-lists/${tierListId}`, {
    method: 'DELETE',
    headers: authHeaders(accessToken),
  }).then((res) => parseOrThrow(res, 'Não foi possível excluir a lista'))
}
