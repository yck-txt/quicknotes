
import React from 'react';
import { NoteType } from '../types';

interface FilterTabsProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  languages: string[];
}

const FilterTabs: React.FC<FilterTabsProps> = ({ currentFilter, onFilterChange, languages }) => {
  const mainFilters: (NoteType | 'ALL')[] = ['ALL', NoteType.NOTE, NoteType.CODE, NoteType.RECIPE];
  const filterLabels: Record<NoteType | 'ALL', string> = {
    ALL: 'Alle',
    [NoteType.NOTE]: 'Notizen',
    [NoteType.CODE]: 'Code',
    [NoteType.RECIPE]: 'Rezepte',
  };

  const isLanguageFilterActive = languages.includes(currentFilter);
  const mainFilterActive = isLanguageFilterActive ? NoteType.CODE : currentFilter;

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
        {mainFilters.map(filter => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ${
              mainFilterActive === filter
                ? 'bg-white dark:bg-slate-600 text-sky-600 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-300/50 dark:hover:bg-slate-700/50'
            }`}
          >
            {filterLabels[filter]}
          </button>
        ))}
      </div>
      {(mainFilterActive === NoteType.CODE && languages.length > 0) && (
        <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-1 rounded-lg flex-wrap justify-end">
          {languages.map(lang => (
            <button
              key={lang}
              onClick={() => onFilterChange(lang)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors duration-200 ${
                currentFilter === lang
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-300/50 dark:hover:bg-slate-700/50'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterTabs;
