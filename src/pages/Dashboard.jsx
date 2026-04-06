import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useNoteStore from '../store/useNoteStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

const Dashboard = () => {
  const { notes } = useNoteStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [filterType, setFilterType] = useState('all');

  // Filter & Sort Logic
  const processedNotes = notes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = filterType === 'all' || note.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.dateCreated) - new Date(a.dateCreated);
      if (sortOrder === 'alphabetical') return a.title.localeCompare(b.title);
      return 0;
    });
  return (
    <div>
      <header className="mb-12 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-serif font-bold text-slate-800">My Slip-Box</h2>
            <p className="text-slate-500 mt-2 italic">"{processedNotes.length} ideas found in the archives."</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-lg outline-none focus:ring-2 ring-amber-100 transition-all text-sm"
              placeholder="Search titles, tags, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border-none rounded-lg px-3 py-2 text-sm text-slate-600 outline-none"
            >
              <option value="all">All Types</option>
              <option value="permanent">Permanent</option>
              <option value="literature">Literature</option>
              <option value="fleeting">Fleeting</option>
            </select>

            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-slate-50 border-none rounded-lg px-3 py-2 text-sm text-slate-600 outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </div>
        </div>
      </header>

      {/* Use processedNotes.map instead of notes.map here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {notes.map((note) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -8 }}
              className="transition-all"
            >
              <Link to={`/note/${note.id}`}>
                <div className="h-64 p-8 bg-white border border-slate-200 shadow-sm rounded-sm relative overflow-hidden flex flex-col group cursor-pointer hover:shadow-xl hover:border-amber-200">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${
                    note.type === 'permanent' ? 'bg-amber-400' : 
                    note.type === 'literature' ? 'bg-blue-400' : 'bg-slate-300'
                  }`} />
                  
                  <span className="text-[10px] font-mono text-slate-400 mb-2 uppercase tracking-widest">{note.type}</span>
                  <h3 className="text-xl font-serif font-bold text-slate-800 mb-3 group-hover:text-amber-700 transition-colors line-clamp-2">
                    {note.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-4 flex-1">
                    {note.content}
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {note.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-100">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Quick Add Placeholder */}
        <Link to="/note/new" className="h-64 border-2 border-dashed border-slate-200 rounded-sm flex items-center justify-center text-slate-300 hover:border-amber-300 hover:text-amber-400 transition-all group">
           <div className="text-center">
             <span className="text-4xl block group-hover:scale-125 transition-transform">+</span>
             <span className="text-xs font-mono uppercase tracking-widest mt-2 block">New Note</span>
           </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;