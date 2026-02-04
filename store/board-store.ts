import { createClient } from '@/lib/supabase'
import { Board, Card, List } from '@/lib/types'
import { create } from 'zustand'
import { arrayMove } from '@dnd-kit/sortable'
import { DragEndEvent } from '@dnd-kit/core'
import { API } from '@/lib/constants'

const supabase = createClient()

interface BoardState {
  boards: Board[]
  board: Board | null
  lists: List[]
  setLists: (lists: List[]) => void
  fetchBoards: () => Promise<void>
  fetchBoardById: (boardId: string) => Promise<void>
  addList: (title: string) => Promise<void>
  addCard: (listId: string, title: string) => Promise<void>
  deleteList: (listId: string) => Promise<void>
  deleteCard: (cardId: string) => Promise<void>
  updateListTitle: (listId: string, newTitle: string) => Promise<void>
  updateCard: (cardId: string, updatedFields: Partial<Card>) => Promise<void>
  handleDragEnd: (event: DragEndEvent) => void
  isCardModalOpen: boolean
  activeCard: Card | null
  openCardModal: (card: Card) => void
  closeCardModal: () => void
}

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: [],
  board: null,
  lists: [],
  isCardModalOpen: false,
  activeCard: null,
  openCardModal: (card) => set({ isCardModalOpen: true, activeCard: card }),
  closeCardModal: () => set({ isCardModalOpen: false, activeCard: null }),
  setLists: (lists) => set({ lists }),
  fetchBoards: async () => {
    try {
      const { data: boards, error } = await supabase
        .from(API.BOARDS)
        .select('*')
        .order('created_at')

      if (error) {
        throw new Error(`Failed to fetch boards: ${error.message}`)
      }

      set({ boards: boards as Board[] })
    } catch (error) {
      console.error('Failed to fetch boards:', error)
      set({ boards: [] })
    }
  },
  fetchBoardById: async (boardId: string) => {
    try {
      const { data: board, error: boardError } = await supabase
        .from(API.BOARDS)
        .select('*')
        .eq('id', boardId)
        .single()

      if (boardError) {
        throw new Error(`Failed to fetch board: ${boardError.message}`)
      }

      const { data: lists, error: listsError } = await supabase
        .from(API.LISTS)
        .select('*, cards(*)')
        .eq('board_id', board.id)
        .order('position')

      if (listsError) {
        throw new Error(`Failed to fetch lists: ${listsError.message}`)
      }

      for (const list of lists) {
        list.cards.sort((a, b) => a.position - b.position)
      }

      set({ board: board as Board, lists })
    } catch (error) {
      console.error('Failed to fetch or create board:', error)
      set({ board: null, lists: [] })
    }
  },
  addList: async (title: string) => {
    const { board, lists } = get()
    if (!board) return

    const newPosition = lists.length
    const { data: newList, error } = await supabase
      .from(API.LISTS)
      .insert({
        title,
        board_id: board.id,
        position: newPosition,
      })
      .select()
      .single()

    if (error || !newList) {
      console.error('Failed to create list:', error)
      return
    }

    set({ lists: [...lists, { ...newList, cards: [] }] })
  },
  addCard: async (listId: string, title: string) => {
    const { lists } = get()
    const targetList = lists.find((list) => list.id === listId)
    if (!targetList) return

    const newPosition = targetList.cards.length
    const { data: newCard, error } = await supabase
      .from(API.CARDS)
      .insert({
        title,
        list_id: listId,
        position: newPosition,
      })
      .select()
      .single()

    if (error || !newCard) {
      console.error('Failed to create card:', error)
      return
    }

    const newLists = lists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          cards: [...list.cards, newCard as Card],
        }
      }
      return list
    })

    set({ lists: newLists })
  },
  deleteList: async (listId: string) => {
    const { error } = await supabase.from(API.LISTS).delete().eq('id', listId)

    if (error) {
      console.error('Failed to delete list:', error)
      return
    }

    const newLists = get().lists.filter((list) => list.id !== listId)
    set({ lists: newLists })
  },
  deleteCard: async (cardId: string) => {
    const { error } = await supabase.from(API.CARDS).delete().eq('id', cardId)

    if (error) {
      console.error('Failed to delete card:', error)
      return
    }

    const newLists = get().lists.map((list) => ({
      ...list,
      cards: list.cards.filter((card) => card.id !== cardId),
    }))
    set({ lists: newLists })
  },
  updateListTitle: async (listId: string, newTitle: string) => {
    const { error } = await supabase
      .from(API.LISTS)
      .update({ title: newTitle })
      .eq('id', listId)

    if (error) {
      console.error('Failed to update list title:', error)
      return
    }

    const newLists = get().lists.map((list) => {
      if (list.id === listId) {
        return { ...list, title: newTitle }
      }
      return list
    })
    set({ lists: newLists })
  },
  updateCard: async (cardId: string, updatedFields: Partial<Card>) => {
    const { error } = await supabase
      .from(API.CARDS)
      .update(updatedFields)
      .eq('id', cardId)

    if (error) {
      console.error('Failed to update card:', error)
      return
    }

    const newLists = get().lists.map((list) => ({
      ...list,
      cards: list.cards.map((card) => {
        if (card.id === cardId) {
          return { ...card, ...updatedFields }
        }
        return card
      }),
    }))
    set({ lists: newLists })
  },
  handleDragEnd: async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const currentLists = get().lists

    // --- Handle list dragging ---
    if (
      active.data.current?.type === 'List' &&
      over.data.current?.type === 'List' &&
      active.id !== over.id
    ) {
      const oldIndex = currentLists.findIndex((list) => list.id === active.id)
      const newIndex = currentLists.findIndex((list) => list.id === over.id)
      const newLists = arrayMove(currentLists, oldIndex, newIndex)

      set({ lists: newLists })

      const updates = newLists.map((list, index) =>
        supabase
          .from(API.LISTS)
          .update({ position: index })
          .eq('id', list.id)
      )
      await Promise.all(updates)
      return
    }

    // --- Handle card dragging ---
    if (active.data.current?.type === 'Card') {
      const newLists = JSON.parse(JSON.stringify(currentLists)) as List[]

      const activeCard = active.data.current.card as Card
      const overId = over.id
      const overIsList = over.data.current?.type === 'List'
      const overIsCard = over.data.current?.type === 'Card'

      const sourceListIndex = newLists.findIndex(
        (l) => l.id === activeCard.list_id
      )
      const sourceList = newLists[sourceListIndex]

      let destListIndex: number | undefined
      if (overIsList) {
        destListIndex = newLists.findIndex((l) => l.id === overId)
      } else if (overIsCard) {
        const overCard = over.data.current?.card as Card
        destListIndex = newLists.findIndex((l) => l.id === overCard.list_id)
      }

      if (sourceListIndex === -1 || destListIndex === undefined) return

      const destList = newLists[destListIndex]

      const sourceCardIndex = sourceList.cards.findIndex(
        (c) => c.id === activeCard.id
      )
      const [removedCard] = sourceList.cards.splice(sourceCardIndex, 1)
      removedCard.list_id = destList.id

      if (sourceList.id === destList.id) {
        const destCardIndex = overIsCard
          ? destList.cards.findIndex((c) => c.id === overId)
          : destList.cards.length
        destList.cards.splice(destCardIndex, 0, removedCard)
      } else {
        if (overIsCard) {
          const destCardIndex = destList.cards.findIndex((c) => c.id === overId)
          destList.cards.splice(destCardIndex, 0, removedCard)
        } else {
          destList.cards.push(removedCard)
        }
      }

      set({ lists: newLists })

      const updates = []
      const updatedSourceList = newLists[sourceListIndex]
      const updatedDestList = newLists[destListIndex]

      for (let i = 0; i < updatedSourceList.cards.length; i++) {
        updates.push(
          supabase
            .from(API.CARDS)
            .update({ position: i })
            .eq('id', updatedSourceList.cards[i].id)
        )
      }
      if (sourceList.id !== destList.id) {
        for (let i = 0; i < updatedDestList.cards.length; i++) {
          updates.push(
            supabase
              .from(API.CARDS)
              .update({ position: i, list_id: destList.id })
              .eq('id', updatedDestList.cards[i].id)
          )
        }
      }
      await Promise.all(updates)
    }
  },
}))
