'use client'
import { useEffect } from 'react'
import { useBoardStore } from '@/store/board-store'
import Board from '@/components/Board'
import * as XLSX from 'xlsx'

export default function BoardPage({ params }: { params: { boardId: string } }) {
  const { fetchBoardById, board, lists } = useBoardStore()

  useEffect(() => {
    fetchBoardById(params.boardId)
  }, [fetchBoardById, params.boardId])

  const handleExport = () => {
    if (!board) return

    const dataToExport = lists.flatMap((list) =>
      list.cards.map((card) => ({
        'List Title': list.title,
        'Card Title': card.title,
        Description: card.description,
        Author: card.author,
        Link: card.link,
        'Start Date': card.start_date,
        'End Date': card.end_date,
      }))
    )

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Board Data')
    XLSX.writeFile(workbook, `${board.title.replace(/ /g, '_')}_export.xlsx`)
  }

  if (!board) {
    return <div>Loading board...</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>{board.title}</h1>
        <button
          onClick={handleExport}
          style={{
            padding: '10px 16px',
            borderRadius: 8,
            border: 'none',
            background: '#16a34a',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <span>📄</span>
          <span>Export to Excel</span>
        </button>
      </div>
      <Board />
    </div>
  )
}
