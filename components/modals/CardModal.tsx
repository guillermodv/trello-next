'use client'
import { useBoardStore } from '@/store/board-store'
import { FormEvent, useEffect, useState } from 'react'

const URL_REGEX = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i

export function CardModal() {
  const { isCardModalOpen, activeCard, closeModal, updateCard } = useBoardStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [author, setAuthor] = useState('')
  const [link, setLink] = useState('')
  const [linkError, setLinkError] = useState('')

  useEffect(() => {
    if (activeCard) {
      setTitle(activeCard.title)
      setDescription(activeCard.description || '')
      setAuthor(activeCard.author || '')
      setLink(activeCard.link || '')
      setLinkError('')
    }
  }, [activeCard])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!activeCard) return

    if (link && !URL_REGEX.test(link)) {
      setLinkError('Please enter a valid URL (e.g., https://example.com)')
      return
    }

    const updatedFields = {
      title: title.trim(),
      description: description.trim(),
      author: author.trim(),
      link: link.trim(),
    }

    updateCard(activeCard.id, updatedFields)
    closeModal()
  }

  if (!isCardModalOpen || !activeCard) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={closeModal}
    >
      <div
        style={{
          background: 'white',
          padding: 24,
          borderRadius: 12,
          width: '90%',
          maxWidth: 600,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: 24 }}>Edit Card</h2>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Author</label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Link URL</label>
            <input
              value={link}
              onChange={(e) => {
                setLink(e.target.value)
                setLinkError('')
              }}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
            {linkError && <p style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{linkError}</p>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
            <button
              type="button"
              onClick={closeModal}
              style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#eee' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#0c66e4', color: 'white' }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
