'use client'
import { FormEvent, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable'
import { useBoardStore } from '@/store/board-store'
import { List } from '@/components/dnd/List'
import { Card } from '@/components/dnd/Card'
import { Card as CardType, List as ListType } from '@/lib/types'
import { MESSAGES, PLACEHOLDERS } from '@/lib/constants'

function AddListForm() {
  const { addList } = useBoardStore()
  const [isAdding, setIsAdding] = useState(false)
  const [newListTitle, setNewListTitle] = useState('')

  const handleAddList = (e: FormEvent) => {
    e.preventDefault()
    if (newListTitle.trim()) {
      addList(newListTitle.trim())
      setNewListTitle('')
      setIsAdding(false)
    }
  }

  return (
    <div
      style={{
        width: 272,
        flexShrink: 0,
      }}
    >
      {isAdding ? (
        <form
          onSubmit={handleAddList}
          style={{ background: '#f1f2f4', padding: 8, borderRadius: 12 }}
        >
          <input
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder={PLACEHOLDERS.ENTER_LIST_TITLE}
            style={{
              width: '100%',
              border: '2px solid #0c66e4',
              padding: 8,
              borderRadius: 8,
              marginBottom: 8,
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
              {MESSAGES.ADD_LIST}
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
            background: 'rgba(0, 0, 0, 0.12)',
            border: 'none',
            color: '#172b4d',
            padding: 12,
            borderRadius: 12,
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          {MESSAGES.ADD_ANOTHER_LIST}
        </button>
      )}
    </div>
  )
}

export default function Board() {
  const { lists, handleDragEnd } = useBoardStore()
  const [activeCard, setActiveCard] = useState<CardType | null>(null)
  const [activeList, setActiveList] = useState<ListType | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    if (active.data.current?.type === 'Card') {
      setActiveCard(active.data.current.card)
    }
    if (active.data.current?.type === 'List') {
      setActiveList(active.data.current.list)
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    setActiveCard(null)
    setActiveList(null)
    handleDragEnd(event)
  }

  const listIds = lists.map((list) => list.id)

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      <div
        style={{
          display: 'flex',
          gap: 16,
          padding: 16,
          overflowX: 'auto',
          height: 'calc(100vh - 40px)',
        }}
      >
        <SortableContext
          items={listIds}
          strategy={horizontalListSortingStrategy}
        >
          {lists.map((list) => (
            <List key={list.id} list={list} />
          ))}
        </SortableContext>
        <AddListForm />
      </div>
      <DragOverlay>
        {activeList ? <List list={activeList} /> : null}
        {activeCard ? <Card card={activeCard} /> : null}
      </DragOverlay>
    </DndContext>
  )
}