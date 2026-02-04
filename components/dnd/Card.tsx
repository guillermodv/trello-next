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
