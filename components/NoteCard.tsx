import React, { useEffect, useRef } from 'react';
import { Note, NoteType } from '../types';
import { CodeIcon } from './icons/CodeIcon';
import { RecipeIcon } from './icons/RecipeIcon';
import { NoteIcon } from './icons/NoteIcon';
import { TrashIcon } from './icons/TrashIcon';
import { EditIcon } from './icons/EditIcon';
import { ExpandIcon } from './icons/ExpandIcon';

interface NoteCardProps {
  note: Note;
  onDelete: (id: number) => void;
  onEdit: (note: Note) => void;
  onView: (note: Note) => void;
}

// Add this declaration for the global hljs object from the script tag
declare global {
  interface Window {
    hljs: any;
  }
}

const typeConfig = {
  [NoteType.NOTE]: {
    icon: <NoteIcon className="h-5 w-5 text-blue-500" />,
    label: 'Notiz',
    borderColor: 'border-blue-500',
  },
  [NoteType.CODE]: {
    icon: <CodeIcon className="h-5 w-5 text-emerald-500" />,
    label: 'Code',
    borderColor: 'border-emerald-500',
  },
  [NoteType.RECIPE]: {
    icon: <RecipeIcon className="h-5 w-5 text-amber-500" />,
    label: 'Rezept',
    borderColor: 'border-amber-500',
  },
};

const renderFormattedContent = (text: string) => {
  const lines = text.split('\n');
  const newLines: string[] = [];
  let inList = false;

  for (const line of lines) {
    let processedLine = line
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    processedLine = processedLine
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    if (line.startsWith('- ')) {
      if (!inList) {
        newLines.push('<ul class="list-disc list-inside space-y-1 my-2">');
        inList = true;
      }
      newLines.push(`<li>${processedLine.substring(2)}</li>`);
    } else {
      if (inList) {
        newLines.push('</ul>');
        inList = false;
      }
      newLines.push(processedLine);
    }
  }

  if (inList) {
    newLines.push('</ul>');
  }
  
  return newLines.join('\n');
};


const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, onEdit, onView }) => {
  const { icon, label, borderColor } = typeConfig[note.type];
  const codeRef = useRef<HTMLElement>(null);

  const getHighlightedCode = (language: string, code: string): string => {
    if (window.hljs) {
      const lang = window.hljs.getLanguage(language) ? language : 'plaintext';
      try {
        return window.hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
      } catch (e) {
        console.error("Highlight.js error:", e);
      }
    }
    return code; // Return plain code if hljs is not available or fails
  };

  const formatTimestamp = (isoString: string) => {
    return new Date(isoString).toLocaleString('de-DE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };
  
  const handleDelete = () => {
    if (window.confirm('Sind Sie sicher, dass Sie diese Notiz löschen möchten?')) {
      onDelete(note.id);
    }
  };

  return (
    <div className={`group relative flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 ${borderColor}`}>
      <div className="p-5 flex-grow overflow-hidden">
        <div className="flex justify-between items-start mb-3">
          <h3 
            className="text-lg font-bold text-slate-800 dark:text-slate-100 pr-20 truncate"
            title={note.title}
          >
            {note.title}
          </h3>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">
            {icon}
            <span>{note.type === NoteType.CODE ? note.language || label : label}</span>
          </div>
        </div>

        {note.type === NoteType.CODE ? (
          <div className="relative max-h-48 overflow-hidden bg-slate-900 dark:bg-black/50 p-3 rounded-md my-2 text-left">
            <pre className="text-sm text-slate-200 whitespace-pre-wrap break-words overflow-x-auto">
              <code ref={codeRef} className={`language-${note.language || 'plaintext'}`} dangerouslySetInnerHTML={{ __html: getHighlightedCode(note.language || 'plaintext', note.content) }}>
              </code>
            </pre>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900 dark:from-black to-transparent pointer-events-none"></div>
          </div>
        ) : (
          <div className="relative max-h-40 overflow-hidden">
            <div
              className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: renderFormattedContent(note.content) }}
            />
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white dark:from-slate-800 to-transparent pointer-events-none"></div>
          </div>
        )}
      </div>
      
      <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-lg flex-shrink-0">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Erstellt: {formatTimestamp(note.createdAt)}
        </p>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <button
          onClick={() => onView(note)}
          className="p-1.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-green-500 hover:text-white dark:hover:bg-green-600 transform scale-90"
          aria-label="Notiz anzeigen"
        >
          <ExpandIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => onEdit(note)}
          className="p-1.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transform scale-90"
          aria-label="Notiz bearbeiten"
        >
          <EditIcon className="h-5 w-5" />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transform scale-90"
          aria-label="Notiz löschen"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default NoteCard;