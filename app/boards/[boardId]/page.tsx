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

  return <Board />
}