import React, { useState } from 'react';
import './NoteCard.css';

const COLOR_MAP = {
  default: '#8888aa',
  purple: '#7c6af7',
  pink: '#f06292',
  cyan: '#26c6da',
  green: '#66bb6a',
  amber: '#ffca28',
  orange: '#ffa726',
  red: '#ef5350',
};

const NoteCard = ({ note, onEdit, onDelete, onTogglePin }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const accentColor = COLOR_MAP[note.color] || COLOR_MAP.default;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete(note._id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 2500);
    }
  };

  const truncate = (text, max = 160) =>
    text && text.length > max ? text.slice(0, max) + '…' : text;

  return (
    <div
      className="note-card"
      style={{ '--note-accent': accentColor }}
      onClick={() => onEdit(note)}
    >
      {/* Top accent bar */}
      <div className="note-card__bar" />

      {/* Header */}
      <div className="note-card__header">
        <h3 className="note-card__title">{note.title || 'Untitled'}</h3>
        <div className="note-card__actions" onClick={(e) => e.stopPropagation()}>
          <button
            className={`note-card__btn pin-btn ${note.pinned ? 'pinned' : ''}`}
            onClick={() => onTogglePin(note)}
            title={note.pinned ? 'Unpin' : 'Pin'}
          >
            <PinIcon pinned={note.pinned} />
          </button>
          <button
            className={`note-card__btn delete-btn ${confirmDelete ? 'confirm' : ''}`}
            onClick={handleDeleteClick}
            title={confirmDelete ? 'Click again to confirm' : 'Delete'}
          >
            {confirmDelete ? <CheckIcon /> : <TrashIcon />}
          </button>
        </div>
      </div>

      {/* Body */}
      <p className="note-card__body">{truncate(note.content)}</p>

      {/* Footer */}
      <div className="note-card__footer">
        <span className="note-card__date">{formatDate(note.updatedAt || note.createdAt)}</span>
        {note.pinned && <span className="note-card__pin-badge">pinned</span>}
      </div>
    </div>
  );
};

// SVG Icons
const PinIcon = ({ pinned }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={pinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,6 5,6 21,6"/>
    <path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/>
    <path d="M10,11v6M14,11v6"/>
    <path d="M9,6V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v2"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);

export default NoteCard;