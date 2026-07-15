import { useState } from 'react'
import { Plus } from 'lucide-react'
import { fetchMovieDirector, fetchTvCreator } from '../api/mediaSearchApi'
import MediaSearch from './MediaSearch'
import './AddItemForm.css'

export default function AddItemForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [creator, setCreator] = useState('')
  const [type, setType] = useState('filme')
  const [artworkUrl, setArtworkUrl] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [erroValidacao, setErroValidacao] = useState('')

  async function handleSelectResult(resultado) {
    setTitle(resultado.title)
    setCreator(resultado.creator ?? '')
    setArtworkUrl(resultado.artwork_url)

    try {
      if (type === 'filme') {
        const diretor = await fetchMovieDirector(resultado.id)
        if (diretor) setCreator(diretor)
      } else if (type === 'serie') {
        const criador = await fetchTvCreator(resultado.id)
        if (criador) setCreator(criador)
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) {
      setErroValidacao('Informe o título.')
      return
    }
    setErroValidacao('')
    setEnviando(true)
    await onAdd({ title: title.trim(), creator, type, artwork_url: artworkUrl })
    setTitle('')
    setCreator('')
    setArtworkUrl(null)
    setEnviando(false)
  }

  return (
    <form onSubmit={handleSubmit} className="add-item-form">
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="filme">Filme</option>
        <option value="album">Álbum</option>
        <option value="serie">Série</option>
      </select>
      <MediaSearch type={type} onSelect={handleSelectResult} />
      <input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
      {erroValidacao && <span className="field-error">{erroValidacao}</span>}
      <input placeholder="Diretor/Artista" value={creator} onChange={(e) => setCreator(e.target.value)} />
      <button type="submit" className="btn-primary" disabled={enviando}>
        <Plus size={16} strokeWidth={2.4} />
        {enviando ? 'Adicionando...' : 'Adicionar'}
      </button>
    </form>
  )
}
