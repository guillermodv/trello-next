'use client'
import { useBoardStore } from '@/store/board-store'
import { FormEvent, useEffect, useState } from 'react'

const URL_REGEX = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i

export function CardModal() {
  const {
    isCardModalOpen,
    activeCard,
    closeCardModal,
    updateCard,
    deleteCard,
  } = useBoardStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [author, setAuthor] = useState('')
  const [link, setLink] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [linkError, setLinkError] = useState('')
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (activeCard) {
      setTitle(activeCard.title)
      setDescription(activeCard.description || '')
      setAuthor(activeCard.author || '')
      setLink(activeCard.link || '')
      setStartDate(activeCard.start_date || '')
      setEndDate(activeCard.end_date || '')
      setLinkError('')
      setSubmitError('')
    }
  }, [activeCard])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!activeCard) return

    if (link && !URL_REGEX.test(link)) {
      setLinkError('Please enter a valid URL (e.g., https://example.com)')
      return
    }
    setLinkError('')
    setSubmitError('')

    const updatedFields = {
      title: title.trim(),
      description: description.trim(),
      author: author.trim(),
      link: link.trim(),
      start_date: startDate || null,
      end_date: endDate || null,
    }

    const error = await updateCard(activeCard.id, updatedFields)

    if (error) {
      setSubmitError(`Error al guardar: ${error.message}`)
    } else {
      closeCardModal()
    }
  }

  const handleDelete = () => {
    if (!activeCard) return
    if (window.confirm('Are you sure you want to delete this card?')) {
      deleteCard(activeCard.id)
      closeCardModal()
    }
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
      onClick={closeCardModal}
    >
      <div
        style={{
          background: 'white',
          padding: 24,
          borderRadius: 12,
          width: '90%',
          maxWidth: 600,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: 24 }}>Edit Tarjeta</h2>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Titulo</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: 8,
                borderRadius: 4,
                border: '1px solid #ccc',
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>
              Descripcion
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: 8,
                borderRadius: 4,
                border: '1px solid #ccc',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>
                Fecha de inicio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: 8,
                  borderRadius: 4,
                  border: '1px solid #ccc',
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>
                Fecha de finalizacion
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: 8,
                  borderRadius: 4,
                  border: '1px solid #ccc',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Autor</label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={{
                width: '100%',
                padding: 8,
                borderRadius: 4,
                border: '1px solid #ccc',
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>
              Link URL adicional
            </label>
            <input
              value={link}
              onChange={(e) => {
                setLink(e.target.value)
                setLinkError('')
              }}
              style={{
                width: '100%',
                padding: 8,
                borderRadius: 4,
                border: '1px solid #ccc',
              }}
            />
            {linkError && (
              <p style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                {linkError}
              </p>
            )}
          </div>

          {submitError && (
            <p style={{ color: 'red', fontSize: 14, marginTop: 16 }}>
              {submitError}
            </p>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
              marginTop: 24,
            }}
          >
            <button
              type="button"
              onClick={handleDelete}
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none',
                background: '#ef4444',
                color: 'white',
                marginRight: 'auto',
              }}
            >
              Delete
            </button>
            <button
              type="button"
              onClick={closeCardModal}
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none',
                background: '#eee',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none',
                background: '#0c66e4',
                color: 'white',
              }}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
