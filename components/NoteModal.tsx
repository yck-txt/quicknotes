
import React, { useEffect, useRef } from 'react';
import { Note, NoteType } from '../types';
import { CodeIcon } from './icons/CodeIcon';
import { RecipeIcon } from './icons/RecipeIcon';
import { NoteIcon } from './icons/NoteIcon';

interface NoteModalProps {
  note: Note | null;
  onClose: () => void;
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
  },
  [NoteType.CODE]: {
    icon: <CodeIcon className="h-5 w-5 text-emerald-500" />,
    label: 'Code',
  },
  [NoteType.RECIPE]: {
    icon: <RecipeIcon className="h-5 w-5 text-amber-500" />,
    label: 'Rezept',
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
  
  return newLines.join('<br />');
};

const NoteModal: React.FC<NoteModalProps> = ({ note, onClose }) => {
  const codeRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (note?.type === NoteType.CODE && codeRef.current && window.hljs) {
      window.hljs.highlightElement(codeRef.current);
    }
  }, [note]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (note) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [note, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && event.target === modalRef.current) {
      onClose();
    }
  };

  if (!note) {
    return null;
  }

  const { icon, label } = typeConfig[note.type];
  const formatTimestamp = (isoString: string) => {
    return new Date(isoString).toLocaleString('de-DE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      aria-labelledby="note-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
        <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300">
              {icon}
              <span>{label}</span>
            </div>
            <h2 id="note-modal-title" className="text-xl font-bold text-slate-800 dark:text-slate-100">{note.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Modal schließen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>
        
        <div className="p-6 flex-grow overflow-y-auto">
          {note.type === NoteType.CODE ? (
            <div className="bg-slate-900 dark:bg-black/50 p-4 rounded-md text-left">
              <pre className="text-sm text-slate-200 whitespace-pre-wrap break-words">
                <code ref={codeRef} className={`language-${note.language || 'plaintext'}`}>
                  {note.content}
                </code>
              </pre>
            </div>
          ) : (
            <div
              className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: renderFormattedContent(note.content) }}
            />
          )}
        </div>

        <footer className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Erstellt: {formatTimestamp(note.createdAt)}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default NoteModal;