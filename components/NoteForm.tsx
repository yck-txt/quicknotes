import React, { useState, useRef, useEffect } from 'react';
import { Note, NoteType } from '../types';
import { GoogleGenAI } from "@google/genai";
import { CodeIcon } from './icons/CodeIcon';
import { RecipeIcon } from './icons/RecipeIcon';
import { NoteIcon } from './icons/NoteIcon';
import { BoldIcon } from './icons/BoldIcon';
import { ItalicIcon } from './icons/ItalicIcon';
import { StrikethroughIcon } from './icons/StrikethroughIcon';
import { ListIcon } from './icons/ListIcon';
import { SparkleIcon } from './icons/SparkleIcon';

interface NoteFormProps {
  onAddNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  editingNote: Note | null;
  onUpdateNote: (note: Note) => void;
  onCancelEdit: () => void;
}

const codeExamples: { [key: string]: string } = {
  javascript: `function helloWorld() {\n  console.log("Hello, World!");\n}`,
  python: `def hello_world():\n    print("Hello, World!")`,
  html: `<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Hallo Welt</h1>\n  </body>\n</html>`,
  css: `body {\n  font-family: sans-serif;\n  background-color: #f0f0f0;\n}`,
  csharp: `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}`,
  java: `class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!"); \n    }\n}`,
  sql: `SELECT * FROM users WHERE status = 'active';`,
  bash: `#!/bin/bash\necho "Hello, World!"`,
  shell: `#!/bin/sh\necho "Hello, World!"`,
  json: `{\n  "message": "Hello, World!",\n  "status": 200\n}`,
  typescript: `function greet(name: string): string {\n  return \`Hello, \${name}!\`;\n}`,
  ruby: `def hello_world\n  puts "Hello, World!"\nend`,
  go: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`,
  php: `<?php\n  echo "Hello, World!";\n?>`,
  rust: `fn main() {\n    println!("Hello, world!");\n}`,
  markdown: `# Titel\n\n- Punkt 1\n- Punkt 2\n\n**Fettgedruckter Text**`,
  yaml: `key: value\nlist:\n  - item1\n  - item2`,
};


const NoteForm: React.FC<NoteFormProps> = ({ onAddNote, editingNote, onUpdateNote, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<NoteType>(NoteType.NOTE);
  const [language, setLanguage] = useState('javascript');
  const [geminiPrompt, setGeminiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [geminiError, setGeminiError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setType(editingNote.type);
      if (editingNote.type === NoteType.CODE) {
        setLanguage(editingNote.language || 'javascript');
      }
    } else {
      setTitle('');
      setContent('');
      setType(NoteType.NOTE);
      setLanguage('javascript');
    }
  }, [editingNote]);

  const handleGenerateContent = async () => {
    if (!geminiPrompt.trim()) return;

    setIsGenerating(true);
    setGeminiError('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: geminiPrompt,
      });
      
      const text = response.text;
      setContent(text);

    } catch (error) {
      console.error('Error generating content:', error);
      setGeminiError('Inhalt konnte nicht generiert werden. Bitte versuchen Sie es erneut.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFormatClick = (prefix: string, suffix: string = prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.focus();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = `${content.substring(0, start)}${prefix}${selectedText}${suffix}${content.substring(end)}`;
    
    setContent(newText);

    setTimeout(() => {
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };
  
  const handleListFormat = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.focus();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const lines = selectedText.split('\n');
    const formattedLines = lines.map((line) => {
      if (line.trim() === '' && lines.length > 1) return line;
      return `- ${line}`;
    });
    const formattedText = formattedLines.join('\n');
    
    const newText = `${content.substring(0, start)}${formattedText}${content.substring(end)}`;
    setContent(newText);

    setTimeout(() => {
      textarea.setSelectionRange(start, start + formattedText.length);
    }, 0);
  };

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newContent = content.substring(0, start) + '  ' + content.substring(end);
      setContent(newContent);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Bitte fülle sowohl Titel als auch Inhalt aus.');
      return;
    }
    
    const noteData = {
      title,
      content,
      type,
      language: type === NoteType.CODE ? language : undefined,
    };

    if (editingNote) {
      onUpdateNote({ ...editingNote, ...noteData });
    } else {
      onAddNote(noteData);
    }
  };

  const typeOptions = [
    { value: NoteType.NOTE, label: 'Notiz', icon: <NoteIcon className="h-5 w-5" /> },
    { value: NoteType.CODE, label: 'Code', icon: <CodeIcon className="h-5 w-5" /> },
    { value: NoteType.RECIPE, label: 'Rezept', icon: <RecipeIcon className="h-5 w-5" /> },
  ];
  
  const languageOptions = [
    'bash', 'c', 'cpp', 'csharp', 'css', 'go', 'html', 'java', 'javascript', 
    'json', 'markdown', 'php', 'python', 'ruby', 'rust', 'scss', 'shell', 
    'sql', 'typescript', 'yaml', 'plaintext'
  ].sort();

  const FormatButton = ({ onClick, label, children }: { onClick: () => void, label: string, children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg transition-shadow hover:shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Titel</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="z.B. Mein React-Snippet"
            className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
          />
        </div>
         <div>
          <span className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Typ</span>
          <div className="flex gap-2">
            {typeOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setType(option.value)}
                disabled={!!editingNote}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all border-2 ${
                  type === option.value
                    ? 'bg-sky-500 text-white border-sky-500 shadow-md'
                    : 'bg-transparent text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        {type === NoteType.CODE && (
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Sprache</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
            >
              {languageOptions.map(lang => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="gemini-prompt" className="block text-sm font-medium text-slate-600 dark:text-slate-300">
            Inhalt mit KI generieren (optional)
          </label>
          <div className="flex gap-2">
            <input
              id="gemini-prompt"
              type="text"
              value={geminiPrompt}
              onChange={(e) => setGeminiPrompt(e.target.value)}
              placeholder="z.B. Erstelle ein Python-Skript, das Dateien umbenennt"
              className="flex-grow px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
              disabled={isGenerating}
            />
            <button
              type="button"
              onClick={handleGenerateContent}
              disabled={isGenerating || !geminiPrompt.trim()}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <SparkleIcon className="h-5 w-5" />
              )}
              <span>{isGenerating ? 'Generiere...' : 'Generieren'}</span>
            </button>
          </div>
          {geminiError && <p className="text-red-500 text-sm mt-1">{geminiError}</p>}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Inhalt</label>
          {type !== NoteType.CODE && (
            <div className="flex items-center gap-1 border border-b-0 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 rounded-t-lg px-2 py-1">
              <FormatButton onClick={() => handleFormatClick('**')} label="Fett">
                <BoldIcon className="h-5 w-5" />
              </FormatButton>
              <FormatButton onClick={() => handleFormatClick('*')} label="Kursiv">
                <ItalicIcon className="h-5 w-5" />
              </FormatButton>
               <FormatButton onClick={() => handleFormatClick('~~')} label="Durchgestrichen">
                <StrikethroughIcon className="h-5 w-5" />
              </FormatButton>
              <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1"></div>
              <FormatButton onClick={handleListFormat} label="Aufzählung">
                <ListIcon className="h-5 w-5" />
              </FormatButton>
            </div>
          )}
          <textarea
            id="content"
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={type === NoteType.CODE ? handleTabKeyDown : undefined}
            rows={type === NoteType.CODE ? 8 : 4}
            placeholder={
              type === NoteType.CODE ? (codeExamples[language] || 'Dein Code-Snippet hier...') :
              type === NoteType.RECIPE ? `Zutaten:\n- 250g Mehl\n\nAnleitung:\n1. Zutaten mischen...` :
              `Deine Gedanken hier...`
            }
            className={`w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${type !== NoteType.CODE ? 'rounded-b-lg rounded-t-none' : 'rounded-lg'} ${type === NoteType.CODE ? 'font-mono text-sm' : ''}`}
          />
        </div>

        <div className="flex items-center gap-4">
            {editingNote && (
                 <button
                    type="button"
                    onClick={onCancelEdit}
                    className="w-full bg-slate-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-800 transition-transform transform active:scale-95"
                  >
                    Abbrechen
                  </button>
            )}
            <button
              type="submit"
              className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800 transition-transform transform active:scale-95 shadow-lg hover:shadow-sky-500/20"
            >
              {editingNote ? 'Notiz aktualisieren' : 'Notiz hinzufügen'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;