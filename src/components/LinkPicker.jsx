import React, { useState } from 'react';
import useNoteStore from '../store/useNoteStore';
import { Search, Plus } from 'lucide-react';

export const LinkPicker = ({ currentNoteId, onSelect, existingLinks }) => {
  const { notes } = useNoteStore();
  const [query, setQuery] = useState('');

  // Don't show the current note or notes already linked
  const filtered = notes.filter(n => 
    n.id !== currentNoteId && 
    !existingLinks.includes(n.id) &&
    (n.title.toLowerCase().includes(query.toLowerCase()) || n.id.includes(query))
  );

  return (
    <div className="p-4 bg-slate-50 border rounded-lg mt-4 shadow-inner">
      <div className="relative mb-3">
        <Search className="absolute left-2 top-2.5 text-slate-400" size={16} />
        <input 
          className="w-full pl-8 pr-4 py-2 text-sm border rounded-md focus:ring-2 ring-amber-200 outline-none"
          placeholder="Search by title or ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="max-h-40 overflow-y-auto space-y-1">
        {filtered.map(n => (
          <button
            key={n.id}
            onClick={() => onSelect(n.id)}
            className="w-full text-left px-3 py-2 text-sm hover:bg-amber-100 rounded flex justify-between items-center group"
          >
            <span className="truncate font-medium">{n.title}</span>
            <Plus size={14} className="text-slate-400 group-hover:text-amber-600" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default LinkPicker;