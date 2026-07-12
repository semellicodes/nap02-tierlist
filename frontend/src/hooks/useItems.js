import { useCallback, useEffect, useState } from 'react'
import * as itemsApi from '../api/itemsApi'

export function useItems(accessToken) {
  const [items, setItems] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const recarregar = useCallback(async () => {
    try {
      setErro('')
      setItems(await itemsApi.fetchItems(accessToken))
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }, [accessToken])

  useEffect(() => {
    recarregar()
  }, [recarregar])

  async function adicionar(novoItem) {
    try {
      await itemsApi.createItem(accessToken, novoItem)
      await recarregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  async function moverTier(itemId, tier) {
    try {
      await itemsApi.updateItemTier(accessToken, itemId, tier)
      await recarregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  async function excluir(itemId) {
    try {
      await itemsApi.deleteItem(accessToken, itemId)
      await recarregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  function buscarHistorico(itemId) {
    return itemsApi.fetchItemHistory(accessToken, itemId)
  }

  return { items, carregando, erro, adicionar, moverTier, excluir, buscarHistorico }
}
