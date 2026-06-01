import React, { useState, useEffect, useRef } from 'react';
import './NoteModal.css';

const COLORS = [
  { id: 'default', hex: '#8888aa', label: 'Default' },
  { id: 'purple',  hex: '#7c6af7', label: 'Purple' },
  { id: 'pink',    hex: '#f06292', label: 'Pink' },
  { id: 'cyan',    hex: '#26c6da', label: 'Cyan' },
  { id: 'green',   hex: '#66bb6a', label: 'Green' },
  { id: 'amber',   hex: '#ffca28', label: 'Amber' },
  { id: 'orange',  hex: '#ffa726', label: 'Orange' },
  { id: 'red',     hex: '#ef5350', label: 'Red' },
];

const NoteModal = ({ isOpen, note, onClose, onSave }) => {
  const [title, setTitle]     = useState('');
  const [content, setContent] = useState('');
  const [color, setColor]     = useState('default');
  const [pinned, setPinned]   = useState(false);
  const [saving, setSaving]   = useState(false);
  const titleRef = useRef(null);

  const isEditing = Boolean(note?._id);

  useEffect(() => {
    if (isOpen) {
      setTitle(note?.title || '');
      setContent(note?.content || '');
      setColor(note?.color || 'default');
      setPinned(note?.pinned || false);
      setSaving(false);
      setTimeout(() => titleRef.current?.focus(), 80);
    }
  }, [isOpen, note]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleSave();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;
    setSaving(true);
    try {
      await onSave({ title: title.trim(), content: content.trim(), color, pinned });
    } finally {
      setSaving(false);
    }
  };

  const selectedColor = COLORS.find(c => c.id === color)?.hex || '#8888aa';

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ '--modal-accent': selectedColor }}>

        {/* Top bar */}
        <div className="modal__bar" />

        {/* Header */}
        <div className="modal__header">
          <span className="modal__label">{isEditing ? 'Edit Note' : 'New Note'}</span>
          <div className="modal__header-actions">
            <button
              className={`modal__pin-btn ${pinned ? 'active' : ''}`}
              onClick={() => setPinned(p => !p)}
              title={pinned ? 'Unpin' : 'Pin note'}
            >
              <StarIcon filled={pinned} />
              {pinned ? 'Pinned' : 'Pin'}
            </button>
            <button className="modal__close-btn" onClick={onClose} title="Close (Esc)">
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Title */}
        <input
          ref={titleRef}
          className="modal__title-input"
          placeholder="Note title…"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={100}
        />

        {/* Content */}
        <textarea
          className="modal__content-input"
          placeholder="Write your note here…"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={8}
        />

        {/* Footer */}
        <div className="modal__footer">
          {/* Color picker */}
          <div className="modal__colors">
            {COLORS.map(c => (
              <button
                key={c.id}
                className={`color-dot ${color === c.id ? 'selected' : ''}`}
                style={{ '--dot-color': c.hex }}
                onClick={() => setColor(c.id)}
                title={c.label}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="modal__buttons">
            <button className="modal__btn cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              className="modal__btn save"
              onClick={handleSave}
              disabled={saving || (!title.trim() && !content.trim())}
            >
              {saving ? <SpinIcon /> : null}
              {saving ? 'Saving…' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>

        <p className="modal__hint">⌘↵ to save &nbsp;·&nbsp; Esc to close</p>
      </div>
    </div>
  );
};

const StarIcon = ({ filled }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const SpinIcon = () => (
  <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

export default NoteModal;