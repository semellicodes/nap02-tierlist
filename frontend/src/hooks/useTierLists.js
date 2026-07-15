import { useCallback, useEffect, useState } from 'react'
import * as tierListsApi from '../api/tierListsApi'

export function useTierLists(accessToken) {
  const [listas, setListas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  const recarregar = useCallback(async () => {
    try {
      setErro('')
      setListas(await tierListsApi.fetchTierLists(accessToken))
    } catch (e) {
      console.error(e)
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
      setMensagem('Lista criada com sucesso!')
    } catch (e) {
      console.error(e)
      setErro(e.message)
    }
  }

  async function renomear(tierListId, name) {
    const anteriores = listas
    setListas((atuais) => atuais.map((l) => (l.id === tierListId ? { ...l, name } : l)))
    try {
      await tierListsApi.renameTierList(accessToken, tierListId, name)
      setMensagem('Lista renomeada com sucesso!')
    } catch (e) {
      console.error(e)
      setListas(anteriores)
      setErro(e.message)
    }
  }

  async function excluir(tierListId) {
    const anteriores = listas
    setListas((atuais) => atuais.filter((l) => l.id !== tierListId))
    try {
      await tierListsApi.deleteTierList(accessToken, tierListId)
      setMensagem('Lista excluída com sucesso!')
    } catch (e) {
      console.error(e)
      setListas(anteriores)
      setErro(e.message)
    }
  }

  return {
    listas,
    carregando,
    erro,
    mensagem,
    limparMensagem: () => setMensagem(''),
    criar,
    renomear,
    excluir,
  }
}
