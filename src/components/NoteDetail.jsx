import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Trash2, Link as LinkIcon } from "lucide-react";
import useNoteStore from "../store/useNoteStore";
import { motion } from "framer-motion";
import NotePreview from "./NotePreview";
import MarkdownRenderer from '../components/MarkdownRenderer';
import { Eye, Edit3, Type } from 'lucide-react';
import LinkPicker from "./LinkPicker"
const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notes, saveNote, deleteNote } = useNoteStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("permanent");
  const [tags, setTags] = useState("");

  const [links, setLinks] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
const [hoveredNote, setHoveredNote] = useState(null);
const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    if (id !== "new") {
      const existingNote = notes.find((n) => n.id === id);
      if (existingNote) {
        // ... previous setters ...
        setLinks(existingNote.links || []);
      }
    }
  }, [id, notes]);

  const addLink = (targetId) => {
    setLinks([...links, targetId]);
    setShowPicker(false);
  };

  const removeLink = (targetId) => {
    setLinks(links.filter((l) => l !== targetId));
  };

  // Calculate Backlinks
  const backlinks = notes.filter((n) => n.links?.includes(id));

  // Load existing note data if editing
  useEffect(() => {
    if (id !== "new") {
      const existingNote = notes.find((n) => n.id === id);
      if (existingNote) {
        setTitle(existingNote.title);
        setContent(existingNote.content);
        setType(existingNote.type);
        setTags(existingNote.tags.join(", "));
      }
    }
  }, [id, notes]);

  const handleSave = () => {
    if (!title.trim()) return alert("Please give your note a title.");

    const noteId = id === "new" ? Date.now().toString() : id;

    const noteData = {
      id: noteId,
      title,
      content,
      type,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
      dateCreated:
        id === "new"
          ? new Date().toISOString()
          : notes.find((n) => n.id === id).dateCreated,
      lastModified: new Date().toISOString(),
    };

    saveNote(noteData);
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-3xl mx-auto"
    >
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => navigate('/')} className="text-slate-500 hover:text-slate-800 flex items-center gap-2">
          <ChevronLeft size={20} /> My Desk
        </button>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button 
              onClick={() => setIsEditing(true)}
              className={`px-3 py-1 rounded-md flex items-center gap-2 text-xs font-bold transition-all ${isEditing ? 'bg-white shadow-sm text-amber-700' : 'text-slate-500'}`}
            >
              <Edit3 size={14} /> EDIT
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className={`px-3 py-1 rounded-md flex items-center gap-2 text-xs font-bold transition-all ${!isEditing ? 'bg-white shadow-sm text-amber-700' : 'text-slate-500'}`}
            >
              <Eye size={14} /> PREVIEW
            </button>
          </div>
          <button onClick={handleSave} className="bg-amber-600 text-white px-6 py-2 rounded-full hover:bg-amber-700 shadow-md">
            Save Note
          </button>
        </div>
      </div>

      {/* The "Paper" */}
      <div className="bg-white p-10 rounded-lg shadow-sm border border-slate-200 min-h-[70vh] flex flex-col">
        {/* Meta Info */}
        <div className="flex gap-4 mb-6 text-xs font-mono text-slate-400">
          <span>ID: {id === "new" ? "Auto-generated" : id}</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-slate-100 text-slate-600 px-2 rounded border-none outline-none cursor-pointer"
          >
            <option value="fleeting">Fleeting</option>
            <option value="literature">Literature</option>
            <option value="permanent">Permanent</option>
          </select>
        </div>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Note Title..."
          className="text-4xl font-serif font-bold text-slate-800 placeholder:text-slate-200 outline-none mb-6 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {isEditing ? (
          <textarea 
            placeholder="Write in Markdown... (e.g. ## Subheading, **bold**, [link]())"
            className="w-full h-[60vh] bg-transparent text-lg text-slate-700 leading-relaxed outline-none resize-none font-mono"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        ) : (
          <div className="min-h-[60vh]">
            <MarkdownRenderer content={content || "*No content yet...*"} />
          </div>
        )}

        {/* Tags Input */}
        <div className="flex items-center gap-2 mb-8 text-slate-400 border-b border-slate-50 pb-2">
          <span className="text-sm font-semibold">#</span>
          <input
            type="text"
            placeholder="tags, separated, by, commas"
            className="text-sm outline-none w-full italic"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        {/* Content Area */}
        <textarea 
  placeholder="Start your thought here using Markdown..."
  className="w-full min-h-[65vh] p-8 text-lg text-slate-700 leading-relaxed 
             bg-white/50 border-2 border-slate-100 rounded-xl
             outline-none transition-all duration-300
             focus:border-amber-200 focus:ring-4 focus:ring-amber-50/50 
             placeholder:text-slate-200 font-mono resize-none
             scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
  value={content}
  onChange={(e) => setContent(e.target.value)}
/>

        {/* Connection UI (Footer) */}
        <div className="mt-12 pt-8 border-t border-slate-100 space-y-8">
  
  {/* Forward Links (Notes this note points to) */}
  <div>
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Related Notes (Links)</h4>
      <button 
        onClick={() => setShowPicker(!showPicker)}
        className="text-xs bg-slate-100 hover:bg-amber-100 text-slate-600 px-2 py-1 rounded transition-colors"
      >
        {showPicker ? 'Close' : '+ Add Link'}
      </button>
    </div>

    {showPicker && <LinkPicker currentNoteId={id} onSelect={addLink} existingLinks={links} />}

    <div className="flex flex-wrap gap-2 mt-3">
      {links.map(linkId => {
        const linkedNote = notes.find(n => n.id === linkId);
        return (
         <div 
  key={linkId} 
  className="relative group"
  onMouseEnter={() => setHoveredNote(notes.find(n => n.id === linkId))}
  onMouseLeave={() => setHoveredNote(null)}
>
  <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full text-sm text-amber-800">
    <span>{notes.find(n => n.id === linkId)?.title}</span>
    <button onClick={() => removeLink(linkId)} className="hover:text-red-500">×</button>
  </div>
  
  {/* The Tooltip */}
  {hoveredNote?.id === linkId && (
    <div className="absolute bottom-full left-0 mb-2">
      <NotePreview note={hoveredNote} />
    </div>
  )}
</div>
        );
      })}
    </div>
  </div>

  {/* Backlinks (Notes that point here) */}
  {backlinks.length > 0 && (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Referenced By (Backlinks)</h4>
      <div className="grid grid-cols-1 gap-2">
        {backlinks.map(bn => (
          <button 
            key={bn.id}
            onClick={() => navigate(`/note/${bn.id}`)}
            className="text-left p-3 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all group"
          >
            <div className="text-sm font-medium text-slate-700 group-hover:text-amber-700">{bn.title}</div>
            <div className="text-[10px] text-slate-400 font-mono">{bn.id}</div>
          </button>
        ))}
      </div>
    </div>
  )}
</div>
      </div>
    </motion.div>
  );
};

export default NoteDetail;
