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
      : '0 1px 1px rgba(0,0,0,0.1)',
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: 'white',
        padding: 16,
        borderRadius: 8,
        boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
        position: 'relative',
        cursor: 'pointer',
      }}
      onClick={() => openCardModal(card)}
      {...attributes}
      {...listeners}
    >
      {card.title}
      {card.link && (
        <div style={{ marginTop: 8 }}>
          <a
            href={card.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontSize: 12,
              color: '#0c66e4',
              wordBreak: 'break-all',
            }}
          >
            🔗 Link
          </a>
        </div>
      )}
    </div>
  )
}
