'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card as CardType } from '@/lib/types'
import { useBoardStore } from '@/store/board-store'
import { useState } from 'react'

interface CardProps {
  card: CardType
}

export function Card({ card }: CardProps) {
  const [isEditing, setIsEditing] = useState(false)

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
    disabled: isEditing,
  })
  const { deleteCard, updateCardTitle } = useBoardStore()
  const [cardTitle, setCardTitle] = useState(card.title)

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

  const handleTitleChange = () => {
    if (cardTitle.trim() && cardTitle.trim() !== card.title) {
      updateCardTitle(card.id, cardTitle.trim())
    }
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style}>
        <textarea
          value={cardTitle}
          onChange={(e) => setCardTitle(e.target.value)}
          onBlur={handleTitleChange}
          onKeyDown={(e) => e.key === 'Enter' && handleTitleChange()}
          autoFocus
          style={{
            width: '100%',
            border: '2px solid #0c66e4',
            borderRadius: 8,
            padding: 14,
            resize: 'vertical',
          }}
        />
      </div>
    )
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
      }}
      onClick={() => setIsEditing(true)}
    >
      <div {...listeners} {...attributes} style={{ cursor: 'grab', paddingRight: 20 }}>
        {card.title}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          deleteCard(card.id)
        }}
        style={{
          position: 'absolute',
          top: 4,
          right: 4,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: 16,
          color: '#6b778c',
          padding: 4,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  )
}
