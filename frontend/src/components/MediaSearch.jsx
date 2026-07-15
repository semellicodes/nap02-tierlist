import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { searchMedia } from '../api/mediaSearchApi'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import './MediaSearch.css'

export default function MediaSearch({ type, onSelect }) {
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [aberto, setAberto] = useState(false)
  const queryDebounced = useDebouncedValue(query, 400)

  useEffect(() => {
    if (queryDebounced.trim().length < 2) {
      setResultados([])
      return
    }

    let cancelado = false
    setBuscando(true)

    searchMedia(queryDebounced, type)
      .then((r) => {
        if (!cancelado) setResultados(r)
      })
      .catch(() => {
        if (!cancelado) setResultados([])
      })
      .finally(() => {
        if (!cancelado) setBuscando(false)
      })

    return () => {
      cancelado = true
    }
  }, [queryDebounced, type])

  function handleSelect(resultado) {
    onSelect(resultado)
    setQuery('')
    setResultados([])
    setAberto(false)
  }

  const mostrarLista = aberto && query.trim().length >= 2

  return (
    <div className="media-search">
      <div className="media-search__input-wrap">
        <Search size={14} strokeWidth={2} className="media-search__icon" />
        <input
          placeholder={
            type === 'filme' ? 'Buscar filme...' : type === 'serie' ? 'Buscar série...' : 'Buscar álbum...'
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setAberto(true)}
          onBlur={() => setTimeout(() => setAberto(false), 150)}
        />
      </div>

      {mostrarLista && (
        <ul className="media-search__results">
          {buscando && <li className="media-search__status">Buscando...</li>}
          {!buscando && resultados.length === 0 && (
            <li className="media-search__status">Nenhum resultado.</li>
          )}
          {resultados.map((r, i) => (
            <li key={r.id}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleSelect(r)
                }}
              >
                <span className="media-search__index">{i + 1}</span>
                {r.artwork_url ? (
                  <img src={r.artwork_url} alt="" />
                ) : (
                  <span className="media-search__no-art" />
                )}
                <span className="media-search__info">
                  <strong>{r.title}</strong>
                  <span>
                    {r.creator}
                    {r.creator && r.year ? ' · ' : ''}
                    {r.year}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
