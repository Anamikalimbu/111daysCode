import React, { useState, useEffect, useCallback } from 'react';
import NoteCard from './components/NoteCard';
import NoteModal from './components/NoteModal';
import { getNotes, createNote, updateNote, deleteNote } from './api';
import './App.css';

const FILTERS = ['all', 'pinned', 'purple', 'pink', 'cyan', 'green', 'amber', 'orange', 'red'];

function App() {
  const [notes, setNotes]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState('');
  const [filter, setFilter]         = useState('all');
  const [modalOpen, setModalOpen]   = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [toast, setToast]           = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const fetchNotes = useCallback(async () => {
    try {
      setError(null);
      const res = await getNotes();
      setNotes(res);
    } catch (err) {
      setError('Could not connect to server. Make sure your backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const handleOpenCreate = () => {
    setEditingNote(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingNote(null);
  };

  const handleSave = async (data) => {
    try {
      const payload = {
        ...data,
        isPinned: data.pinned,
      };

      if (editingNote?._id) {
        const res = await updateNote(editingNote._id, payload);
        setNotes(prev => prev.map(n => n._id === editingNote._id ? res : n));
        showToast('Note updated!');
      } else {
        const res = await createNote(payload);
        setNotes(prev => [res, ...prev]);
        showToast('Note created!');
      }
      handleModalClose();
    } catch {
      showToast('Failed to save note.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      setNotes(prev => prev.filter(n => n._id !== id));
      showToast('Note deleted.', 'info');
    } catch {
      showToast('Failed to delete note.', 'error');
    }
  };

  const handleTogglePin = async (note) => {
    try {
      const res = await updateNote(note._id, { ...note, isPinned: !note.pinned });
      setNotes(prev => prev.map(n => n._id === note._id ? res : n));
    } catch {
      showToast('Could not update pin.', 'error');
    }
  };

  // Filter + search
  const filteredNotes = notes
    .filter(n => {
      if (filter === 'pinned') return n.pinned;
      if (filter !== 'all') return n.color === filter;
      return true;
    })
    .filter(n => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        n.title?.toLowerCase().includes(q) ||
        n.content?.toLowerCase().includes(q)
      );
    });

  // Sort: pinned first, then by updated date
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
  });

  const pinnedCount = notes.filter(n => n.pinned).length;

  return (
    <div className="app">
      {/* Background grid */}
      <div className="app__bg-grid" />

      {/* Header */}
      <header className="app__header">
        <div className="app__header-inner">
          <div className="app__brand">
            <div className="app__logo">
              <LogoIcon />
            </div>
            <div>
              <h1 className="app__title">NoteStack</h1>
              <p className="app__subtitle">
                {notes.length} note{notes.length !== 1 ? 's' : ''}
                {pinnedCount > 0 && ` · ${pinnedCount} pinned`}
              </p>
            </div>
          </div>

          <button className="app__new-btn" onClick={handleOpenCreate}>
            <PlusIcon />
            New Note
          </button>
        </div>

        {/* Search + Filters */}
        <div className="app__toolbar">
          <div className="app__search-wrap">
            <SearchIcon />
            <input
              className="app__search"
              type="text"
              placeholder="Search notes…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="app__search-clear" onClick={() => setSearch('')}>
                <CloseIcon />
              </button>
            )}
          </div>

          <div className="app__filters">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`app__filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="app__main">
        {loading && (
          <div className="app__state">
            <div className="app__loader">
              <SpinIcon />
            </div>
            <p>Loading notes…</p>
          </div>
        )}

        {error && !loading && (
          <div className="app__state app__state--error">
            <ErrorIcon />
            <p>{error}</p>
            <button className="app__retry-btn" onClick={fetchNotes}>Retry</button>
          </div>
        )}

        {!loading && !error && sortedNotes.length === 0 && (
          <div className="app__state">
            <EmptyIcon />
            <p className="app__empty-title">
              {search || filter !== 'all' ? 'No matching notes' : 'No notes yet'}
            </p>
            <p className="app__empty-sub">
              {search || filter !== 'all'
                ? 'Try a different search or filter'
                : 'Create your first note to get started'}
            </p>
            {!search && filter === 'all' && (
              <button className="app__empty-btn" onClick={handleOpenCreate}>
                <PlusIcon /> Create a Note
              </button>
            )}
          </div>
        )}

        {!loading && !error && sortedNotes.length > 0 && (
          <div className="app__grid">
            {sortedNotes.map(note => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating create button (mobile) */}
      <button className="app__fab" onClick={handleOpenCreate}>
        <PlusIcon />
      </button>

      {/* Modal */}
      <NoteModal
        isOpen={modalOpen}
        note={editingNote}
        onClose={handleModalClose}
        onSave={handleSave}
      />

      {/* Toast */}
      {toast && (
        <div className={`app__toast app__toast--${toast.type}`}>
          {toast.type === 'success' && <CheckIcon />}
          {toast.type === 'error' && <ErrorSmIcon />}
          {toast.type === 'info' && <InfoIcon />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// Icons
const LogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10,9 9,9 8,9"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const SpinIcon = () => (
  <svg className="spin" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);
const ErrorIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const EmptyIcon = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);
const ErrorSmIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

export default App;