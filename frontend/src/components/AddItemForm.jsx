import { useState } from 'react'
import { Plus } from 'lucide-react'
import { fetchMovieDirector } from '../api/mediaSearchApi'
import MediaSearch from './MediaSearch'
import './AddItemForm.css'

export default function AddItemForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [creator, setCreator] = useState('')
  const [type, setType] = useState('filme')
  const [artworkUrl, setArtworkUrl] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function handleSelectResult(resultado) {
    setTitle(resultado.title)
    setCreator(resultado.creator ?? '')
    setArtworkUrl(resultado.artwork_url)

    if (type === 'filme') {
      const diretor = await fetchMovieDirector(resultado.id)
      if (diretor) setCreator(diretor)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    await onAdd({ title, creator, type, artwork_url: artworkUrl })
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
      </select>
      <MediaSearch type={type} onSelect={handleSelectResult} />
      <input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input placeholder="Diretor/Artista" value={creator} onChange={(e) => setCreator(e.target.value)} />
      <button type="submit" className="btn-primary" disabled={enviando}>
        <Plus size={16} strokeWidth={2.4} />
        {enviando ? 'Adicionando...' : 'Adicionar'}
      </button>
    </form>
  )
}
