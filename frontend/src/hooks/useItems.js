import { useCallback, useEffect, useState } from 'react'
import * as itemsApi from '../api/itemsApi'

export function useItems(accessToken, tierListId) {
  const [items, setItems] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const recarregar = useCallback(async () => {
    try {
      setErro('')
      setItems(await itemsApi.fetchItems(accessToken, tierListId))
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }, [accessToken, tierListId])

  useEffect(() => {
    recarregar()
  }, [recarregar])

  async function adicionar(novoItem) {
    try {
      await itemsApi.createItem(accessToken, { ...novoItem, tier_list_id: tierListId })
      await recarregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  async function moverTier(itemId, tier) {
    const anteriores = items
    setErro('')
    setItems((atuais) => atuais.map((item) => (item.id === itemId ? { ...item, tier } : item)))
    try {
      await itemsApi.updateItemTier(accessToken, itemId, tier)
    } catch (e) {
      setItems(anteriores)
      setErro(e.message)
    }
  }

  async function excluir(itemId) {
    const anteriores = items
    setErro('')
    setItems((atuais) => atuais.filter((item) => item.id !== itemId))
    try {
      await itemsApi.deleteItem(accessToken, itemId)
    } catch (e) {
      setItems(anteriores)
      setErro(e.message)
    }
  }

  function buscarHistorico(itemId) {
    return itemsApi.fetchItemHistory(accessToken, itemId)
  }

  return { items, carregando, erro, adicionar, moverTier, excluir, buscarHistorico }
}
