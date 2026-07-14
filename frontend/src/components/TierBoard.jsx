import { useRef, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { ArrowLeft, Download } from 'lucide-react'
import { TIERS } from '../constants/tiers'
import { useItems } from '../hooks/useItems'
import { exportElementAsImage } from '../lib/exportImage'
import Header from './Header'
import AddItemForm from './AddItemForm'
import TierRow from './TierRow'
import UnrankedPool from './UnrankedPool'
import ItemCard from './ItemCard'
import HistoryPanel from './HistoryPanel'
import './TierBoard.css'

function tierFromDroppableId(id) {
  return id === 'tier-pool' ? null : id.replace('tier-', '')
}

export default function TierBoard({ session, tierList, onSignOut, onBack }) {
  const { items, erro, adicionar, moverTier, excluir, buscarHistorico } = useItems(
    session.access_token,
    tierList.id,
  )
  const [historicoItem, setHistoricoItem] = useState(null)
  const [historicoEntradas, setHistoricoEntradas] = useState([])
  const [itemArrastado, setItemArrastado] = useState(null)
  const [exportando, setExportando] = useState(false)
  const [erroExport, setErroExport] = useState('')
  const rowsRef = useRef(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  )

  async function handleShowHistory(item) {
    const entradas = await buscarHistorico(item.id)
    setHistoricoEntradas(entradas)
    setHistoricoItem(item)
  }

  async function handleDelete(itemId) {
    await excluir(itemId)
    if (historicoItem?.id === itemId) setHistoricoItem(null)
  }

  function handleDragStart(event) {
    setItemArrastado(event.active.data.current.item)
  }

  function handleDragEnd(event) {
    setItemArrastado(null)
    const { active, over } = event
    if (!over) return

    const item = active.data.current.item
    const novoTier = tierFromDroppableId(over.id)
    if (item.tier !== novoTier) {
      moverTier(item.id, novoTier)
    }
  }

  async function handleExport() {
    if (!rowsRef.current) return
    setExportando(true)
    setErroExport('')
    try {
      await exportElementAsImage(rowsRef.current, 'tier-list.png')
    } catch (e) {
      setErroExport(e.message || 'Não foi possível exportar a imagem.')
    } finally {
      setExportando(false)
    }
  }

  const itemsSemTier = items.filter((item) => !item.tier)

  return (
    <div className="tier-board">
      <Header email={session.user.email} onSignOut={onSignOut} />

      {(erro || erroExport) && <p className="tier-board__error">{erro || erroExport}</p>}

      <AddItemForm onAdd={adicionar} />

      <div className="tier-board__toolbar">
        <button type="button" className="btn-outline" onClick={onBack}>
          <ArrowLeft size={14} strokeWidth={2} />
          Minhas listas
        </button>
        <h2 className="tier-board__list-name">{tierList.name}</h2>
        <button type="button" className="btn-outline" onClick={handleExport} disabled={exportando}>
          <Download size={14} strokeWidth={2} />
          {exportando ? 'Exportando...' : 'Exportar imagem'}
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="tier-board__rows" ref={rowsRef}>
          {TIERS.map((tier) => (
            <TierRow
              key={tier.key}
              tier={tier}
              items={items.filter((item) => item.tier === tier.key)}
              onDelete={handleDelete}
              onShowHistory={handleShowHistory}
            />
          ))}
        </div>

        <UnrankedPool items={itemsSemTier} onDelete={handleDelete} onShowHistory={handleShowHistory} />

        <DragOverlay>
          {itemArrastado ? (
            <ItemCard item={itemArrastado} onDelete={() => {}} onShowHistory={() => {}} />
          ) : null}
        </DragOverlay>
      </DndContext>

      <HistoryPanel item={historicoItem} entries={historicoEntradas} onClose={() => setHistoricoItem(null)} />
    </div>
  )
}
