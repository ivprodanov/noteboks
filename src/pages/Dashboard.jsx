import React, { useState } from "react";
import { Link } from "react-router-dom";
import useNoteStore from "../store/useNoteStore";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2 } from "lucide-react";

const Dashboard = () => {
  const { bokses, currentBoksId, deleteNote } = useNoteStore();

  const activeBoks = bokses.find((b) => b.id === currentBoksId);
  const notes = activeBoks ? activeBoks.notes : [];
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [filterType, setFilterType] = useState("all");

  const processedNotes = notes
    .filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = filterType === "all" || note.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.dateCreated) - new Date(a.dateCreated);
      if (sortOrder === "alphabetical") return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <div>
      <header className="mb-12 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-serif font-bold text-slate-800">
              {activeBoks?.name || "My Slip-Box"}
            </h2>
            <p className="text-slate-500 mt-2 italic">
              "{processedNotes.length} ideas found in this boks."
            </p>
          </div>
        </div>

        {/* Search Bar UI stays the same */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-lg outline-none focus:ring-2 ring-amber-100 transition-all text-sm"
              placeholder="Search current boks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="bg-slate-50 border-none rounded-lg px-3 py-2 text-sm text-slate-600 outline-none">
              <option value="all">All Types</option>
              <option value="permanent">Permanent</option>
              <option value="literature">Literature</option>
              <option value="fleeting">Fleeting</option>
            </select>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="bg-slate-50 border-none rounded-lg px-3 py-2 text-sm text-slate-600 outline-none">
              <option value="newest">Newest First</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </div>
        </div>
      </header>

      {/* 1. mode="popLayout" prevents cards from "jumping" during exit.
          2. key={currentBoksId} forces a clean transition between bokses.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout" initial={false}>
          {processedNotes.map((note) => (
            <motion.div
              key={`${currentBoksId}-${note.id}`} // Unique key per Boks
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <Link to={`/note/${note.id}`}>
<div className="h-64 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl relative overflow-hidden flex flex-col group cursor-pointer hover:shadow-xl dark:hover:border-amber-500/50 transition-all duration-300">                  <div className={`absolute top-0 left-0 w-1.5 h-full ${
                    note.type === "permanent" ? "bg-amber-400" : 
                    note.type === "literature" ? "bg-blue-400" : "bg-slate-300"
                  }`} />

                  <span className="text-[10px] font-mono text-slate-400 mb-2 uppercase tracking-widest">{note.type}</span>
                  <h3 className="text-xl font-serif font-bold text-slate-800 dark:text-slate-100 mb-3 group-hover:text-amber-700 dark:group-hover:text-amber-400">{note.title}</h3>
<p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-4 flex-1">
  {note.content
    .replace(/[#*`>]/g, '') // Strips #, *, `, and > symbols
    .replace(/\[\[\d+\]\]/g, '') // Strips WikiLinks like [[123]]
    .trim()}
</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-100">#{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (confirm("Delete note?")) deleteNote(note.id);
                }}
                className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 p-2 bg-white/90 rounded-full text-slate-400 hover:text-red-500 hover:scale-110 transition-all shadow-md border border-slate-100"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Quick Add Placeholder (No animation needed here) */}
        <Link
          to="/note/new"
          className="h-64 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-300 hover:border-amber-300 hover:text-amber-400 transition-all group bg-white/30"
        >
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