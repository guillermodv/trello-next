'use client'
import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useBoardStore } from '@/store/board-store'
import { createClient } from '@/lib/supabase'
import {
  API,
  MESSAGES,
  PLACEHOLDERS,
  ROUTES,
} from '@/lib/constants'

const supabase = createClient()

function CreateBoardForm() {
  const { fetchBoards } = useBoardStore()
  const [newBoardTitle, setNewBoardTitle] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateBoard = async (e: FormEvent) => {
    e.preventDefault()
    if (newBoardTitle.trim()) {
      const { error } = await supabase
        .from(API.BOARDS)
        .insert({ title: newBoardTitle.trim() })
        .single()

      if (error) {
        console.error('Failed to create board:', error)
      } else {
        await fetchBoards()
        setNewBoardTitle('')
        setIsCreating(false)
      }
    }
  }

  return (
    <div>
      {isCreating ? (
        <form
          onSubmit={handleCreateBoard}
          style={{
            padding: 16,
            background: '#f1f2f4',
            borderRadius: 12,
            marginTop: 16,
          }}
        >
          <input
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            placeholder={PLACEHOLDERS.ENTER_BOARD_TITLE}
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
              {MESSAGES.CREATE_BOARD}
            </button>
            <button
              onClick={() => setIsCreating(false)}
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
          onClick={() => setIsCreating(true)}
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.05)',
            border: 'none',
            color: '#172b4d',
            padding: 12,
            borderRadius: 12,
            textAlign: 'center',
            cursor: 'pointer',
            marginTop: 16,
          }}
        >
          {MESSAGES.CREATE_NEW_BOARD}
        </button>
      )}
    </div>
  )
}

export default function BoardsPage() {
  const { boards, fetchBoards } = useBoardStore()

  useEffect(() => {
    fetchBoards()
  }, [fetchBoards])

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>
        {MESSAGES.MY_BOARDS}
      </h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
        }}
      >
        {boards.map((board) => (
          <Link
            href={`${ROUTES.BOARDS}/${board.id}`}
            key={board.id}
            style={{
              display: 'block',
              padding: 16,
              background: '#f1f2f4',
              borderRadius: 12,
              textDecoration: 'none',
              color: '#172b4d',
              fontWeight: 'bold',
              minHeight: 100,
            }}
          >
            {board.title}
          </Link>
        ))}
      </div>
      <CreateBoardForm />
    </div>
  )
}

