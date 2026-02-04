'use client'
import { MESSAGES } from '@/lib/constants'
import { List as ListType } from '@/lib/types'
import { useBoardStore } from '@/store/board-store'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FormEvent, useState } from 'react'
import { Card } from './Card'

interface ListProps {
  list: ListType
}

export function List({ list }: ListProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: { type: 'List', list },
    disabled: isEditingTitle,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const cardIds = list.cards.map((card) => card.id)
  const { addCard, deleteList, updateListTitle } = useBoardStore()
  const [isAdding, setIsAdding] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')
  const [listTitle, setListTitle] = useState(list.title)

  const handleAddCard = (e: FormEvent) => {
    e.preventDefault()
    if (newCardTitle.trim()) {
      addCard(list.id, newCardTitle.trim())
      setNewCardTitle('')
      setIsAdding(false)
    }
  }

  const handleTitleChange = () => {
    if (listTitle.trim() && listTitle.trim() !== list.title) {
      updateListTitle(list.id, listTitle.trim())
    }
    setIsEditingTitle(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        width: 272,
        background: '#f1f2f4',
        borderRadius: 12,
        padding: 8,
        alignSelf: 'flex-start',
      }}
      {...attributes}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        {isEditingTitle ? (
          <input
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
            onBlur={handleTitleChange}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleChange()}
            autoFocus
            style={{
              width: '100%',
              border: '2px solid #0c66e4',
              padding: 4,
              borderRadius: 4,
              margin: '4px 8px',
              flexGrow: 1,
            }}
          />
        ) : (
          <div
            style={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => setIsEditingTitle(true)}
          >
            <h2
              style={{ padding: '4px 8px', cursor: 'grab' }}
              {...listeners}
            >
              {list.title}
            </h2>
          </div>
        )}
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this list?')) {
              deleteList(list.id)
            }
          }}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: 16,
            color: '#6b778c',
            padding: 4,
          }}
        >
          ×
        </button>
      </div>
      <SortableContext
        items={cardIds}
        strategy={verticalListSortingStrategy}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {list.cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
      <div style={{ marginTop: 16 }}>
        {isAdding ? (
          <form onSubmit={handleAddCard}>
            <textarea
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder={MESSAGES.CARD_TITLE}
              style={{
                width: '100%',
                border: 'none',
                padding: 8,
                borderRadius: 8,
                marginBottom: 8,
                resize: 'vertical',
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="submit"
                style={{
                  background: '#0c66e4',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                {MESSAGES.ADD_CARD}
              </button>
              <button
                onClick={() => setIsAdding(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 20,
                }}
              >
                ×
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              padding: 8,
              borderRadius: 8,
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            {MESSAGES.ADD_CARD}
          </button>
        )}
      </div>
    </div>
  )
}
