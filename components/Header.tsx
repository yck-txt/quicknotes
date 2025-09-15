
import React from 'react';
import { NoteIcon } from './icons/NoteIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800/50 backdrop-blur-sm shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center gap-3">
        <NoteIcon className="h-8 w-8 text-sky-500" />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          Yotez
        </h1>
      </div>
    </header>
  );
};

export default Header;