import { useCallback, useEffect, useState } from 'react'
import * as itemsApi from '../api/itemsApi'

export function useItems(accessToken, tierListId) {
  const [items, setItems] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  const recarregar = useCallback(async () => {
    try {
      setErro('')
      setItems(await itemsApi.fetchItems(accessToken, tierListId))
    } catch (e) {
      console.error(e)
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
      setMensagem('Item adicionado com sucesso!')
    } catch (e) {
      console.error(e)
      setErro(e.message)
    }
  }

  async function moverTier(itemId, tier) {
    const anteriores = items
    setErro('')
    setItems((atuais) => atuais.map((item) => (item.id === itemId ? { ...item, tier } : item)))
    try {
      await itemsApi.updateItemTier(accessToken, itemId, tier)
      setMensagem('Item atualizado com sucesso!')
    } catch (e) {
      console.error(e)
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
      setMensagem('Item excluído com sucesso!')
    } catch (e) {
      console.error(e)
      setItems(anteriores)
      setErro(e.message)
    }
  }

  async function buscarHistorico(itemId) {
    try {
      return await itemsApi.fetchItemHistory(accessToken, itemId)
    } catch (e) {
      console.error(e)
      setErro(e.message)
      return []
    }
  }

  return {
    items,
    carregando,
    erro,
    mensagem,
    limparMensagem: () => setMensagem(''),
    adicionar,
    moverTier,
    excluir,
    buscarHistorico,
  }
}
