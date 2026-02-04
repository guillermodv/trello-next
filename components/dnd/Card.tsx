'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card as CardType } from '@/lib/types'
import { useBoardStore } from '@/store/board-store'

interface CardProps {
  card: CardType
}

export function Card({ card }: CardProps) {
  const { openCardModal } = useBoardStore()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { type: 'Card', card },
  })

  const style = {
    transition,
    opacity: isDragging ? 0.9 : 1,
    transform: isDragging
      ? `${CSS.Transform.toString(transform)} rotate(3deg)`
      : CSS.Transform.toString(transform),
    boxShadow: isDragging
      ? '0 12px 24px rgba(0,0,0,0.2)'
      : '0 1px 2px rgba(0,0,0,0.1)',
  }

  const Labels = () => (
    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
      <div
        style={{
          width: '32px',
          height: '8px',
          borderRadius: '4px',
          background: '#4bce97',
        }}
      ></div>
      <div
        style={{
          width: '32px',
          height: '8px',
          borderRadius: '4px',
          background: '#f5cd47',
        }}
      ></div>
    </div>
  )

  const Dates = () => {
    if (!card.start_date && !card.end_date) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0) 

    const endDate = card.end_date ? new Date(card.end_date) : null
    let dateColor = '#5e6c84'
    if (endDate) {
      if (endDate < today) {
        dateColor = '#ef4444' // red
      } else if (endDate.getTime() === today.getTime()) {
        dateColor = '#f59e0b' // amber
      }
    }

    return (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center', fontSize: '12px', color: dateColor }}>
        <span>📅</span>
        {card.start_date && <span>{new Date(card.start_date).toLocaleDateString()}</span>}
        {card.start_date && card.end_date && <span>-</span>}
        {card.end_date && <span>{new Date(card.end_date).toLocaleDateString()}</span>}
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: 'white',
        padding: '8px',
        borderRadius: '8px',
        boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
      onClick={() => openCardModal(card)}
      {...attributes}
      {...listeners}
    >
      <Labels />
      <p style={{ fontSize: '14px', color: '#172b4d' }}>{card.title}</p>
      <Dates />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {card.description && (
            <span style={{ fontSize: '12px', color: '#5e6c84' }}>📝</span>
          )}
          {card.link && (
            <a
              href={card.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                fontSize: '12px',
                color: '#5e6c84',
                textDecoration: 'none',
              }}
            >
              🔗
            </a>
          )}
        </div>
        {card.author && (
          <div style={{ fontSize: '12px', color: '#5e6c84' }}>
            {card.author}
          </div>
        )}
      </div>
    </div>
  )
}
