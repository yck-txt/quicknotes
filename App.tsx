
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Note, NoteType } from './types';
import Header from './components/Header';
import NoteForm from './components/NoteForm';
import FilterTabs from './components/FilterTabs';
import NoteList from './components/NoteList';
import LoginScreen from './components/LoginScreen';
import NoteModal from './components/NoteModal';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('is-authenticated') === 'true';
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const savedNotes = localStorage.getItem('quick-notes');
      return savedNotes ? JSON.parse(savedNotes) : [];
    } catch (error) {
      console.error('Failed to parse notes from localStorage', error);
      return [];
    }
  });
  
  const [filter, setFilter] = useState<string>('ALL');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('quick-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = useCallback((note: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = {
      ...note,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    setNotes(prevNotes => [newNote, ...prevNotes]);
  }, []);

  const deleteNote = useCallback((id: number) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  }, []);

  const updateNote = useCallback((updatedNote: Note) => {
    setNotes(prevNotes => 
      prevNotes.map(note => note.id === updatedNote.id ? updatedNote : note)
    );
    setEditingNote(null);
  }, []);

  const handleEdit = useCallback((note: Note) => {
    setEditingNote(note);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleView = useCallback((note: Note) => {
    setViewingNote(note);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingNote(null);
  }, []);

  const closeModal = useCallback(() => {
    setViewingNote(null);
  }, []);
  
  const handleLogin = (password: string): boolean => {
    if (password === 'test123') {
      sessionStorage.setItem('is-authenticated', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };
  
  const codeLanguages = useMemo(() => {
    const languages = new Set(
      notes
        .filter(note => note.type === NoteType.CODE && note.language)
        .map(note => note.language!)
    );
    return Array.from(languages).sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    // Zuerst prüfen, ob der Filter eine bekannte Programmiersprache ist.
    if (codeLanguages.includes(filter)) {
      return notes.filter(note => note.type === NoteType.CODE && note.language === filter);
    }
    
    // Ansonsten die Standardfilter anwenden.
    switch (filter) {
      case 'ALL':
        return notes;
      case NoteType.NOTE:
      case NoteType.CODE:
      case NoteType.RECIPE:
        return notes.filter(note => note.type === filter);
      default:
        // Fallback für einen unbekannten Filter.
        return notes;
    }
  }, [notes, filter, codeLanguages]);


  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div ref={formRef} className="max-w-2xl mx-auto mb-8 scroll-mt-20">
          <h2 className="text-2xl font-bold text-center mb-4 text-slate-700 dark:text-slate-300">
            {editingNote ? 'Notiz bearbeiten' : 'Neue Notiz erstellen'}
          </h2>
          <NoteForm 
            onAddNote={addNote} 
            editingNote={editingNote}
            onUpdateNote={updateNote}
            onCancelEdit={cancelEdit}
          />
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
             <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">Deine Notizen</h2>
             <FilterTabs 
                currentFilter={filter} 
                onFilterChange={setFilter} 
                languages={codeLanguages}
             />
          </div>
          <NoteList 
            notes={filteredNotes} 
            onDeleteNote={deleteNote} 
            onEditNote={handleEdit}
            onViewNote={handleView}
          />
        </div>
      </main>
      <NoteModal note={viewingNote} onClose={closeModal} />
    </div>
  );
};

export default App;
