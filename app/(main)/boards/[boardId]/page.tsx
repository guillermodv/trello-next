'use client'
import { useEffect } from 'react'
import { useBoardStore } from '@/store/board-store'
import Board from '@/components/Board'

export default function BoardPage({ params }: { params: { boardId: string } }) {
  const { fetchBoardById, board } = useBoardStore()

  useEffect(() => {
    fetchBoardById(params.boardId)
  }, [fetchBoardById, params.boardId])

  if (!board) {
    return <div>Loading board...</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        {board.title}
      </h1>
      <Board />
    </div>
  )
}
