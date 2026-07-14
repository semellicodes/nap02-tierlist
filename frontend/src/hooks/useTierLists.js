import { useCallback, useEffect, useState } from 'react'
import * as tierListsApi from '../api/tierListsApi'

export function useTierLists(accessToken) {
  const [listas, setListas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const recarregar = useCallback(async () => {
    try {
      setErro('')
      setListas(await tierListsApi.fetchTierLists(accessToken))
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }, [accessToken])

  useEffect(() => {
    recarregar()
  }, [recarregar])

  async function criar(name) {
    try {
      await tierListsApi.createTierList(accessToken, name)
      await recarregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  async function renomear(tierListId, name) {
    const anteriores = listas
    setListas((atuais) => atuais.map((l) => (l.id === tierListId ? { ...l, name } : l)))
    try {
      await tierListsApi.renameTierList(accessToken, tierListId, name)
    } catch (e) {
      setListas(anteriores)
      setErro(e.message)
    }
  }

  async function excluir(tierListId) {
    const anteriores = listas
    setListas((atuais) => atuais.filter((l) => l.id !== tierListId))
    try {
      await tierListsApi.deleteTierList(accessToken, tierListId)
    } catch (e) {
      setListas(anteriores)
      setErro(e.message)
    }
  }

  return { listas, carregando, erro, criar, renomear, excluir }
}
