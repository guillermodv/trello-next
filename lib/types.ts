export interface Card {
  id: string
  list_id: string
  title: string
  description: string | null
  position: number
  author: string | null
  link: string | null
  start_date: string | null
  end_date: string | null
}

export interface List {
  id: string
  board_id: string
  title: string
  position: number
  cards: Card[]
}

export interface Board {
  id: string
  title: string
  lists: List[]
}
