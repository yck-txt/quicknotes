
import React from 'react';
import { Note } from '../types';
import NoteCard from './NoteCard';

interface NoteListProps {
  notes: Note[];
  onDeleteNote: (id: number) => void;
  onEditNote: (note: Note) => void;
  onViewNote: (note: Note) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onDeleteNote, onEditNote, onViewNote }) => {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Noch keine Notizen!</h3>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Erstelle oben deine erste Notiz, um loszulegen.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map(note => (
        <NoteCard key={note.id} note={note} onDelete={onDeleteNote} onEdit={onEditNote} onView={onViewNote} />
      ))}
    </div>
  );
};

export default NoteList;
