import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Save,
  Trash2,
  Link as LinkIcon,
  Eye,
  Edit3,
} from "lucide-react";
import useNoteStore from "../store/useNoteStore";
import { motion, AnimatePresence } from "framer-motion";
import NotePreview from "./NotePreview";
import MarkdownRenderer from "../components/MarkdownRenderer";
import LinkPicker from "./LinkPicker";

const NoteDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { bokses, currentBoksId, saveNote, deleteNote } = useNoteStore();

  const activeBoks = bokses.find((b) => b.id === currentBoksId);
  const notes = activeBoks ? activeBoks.notes : [];
  const backlinks = notes.filter((n) => n.links?.includes(id));

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("permanent");
  const [tags, setTags] = useState("");
  const [links, setLinks] = useState([]);

  const [showPicker, setShowPicker] = useState(false);
  const [hoveredNote, setHoveredNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const textareaRef = React.useRef(null);
const titleRef = React.useRef(null)
useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    }
  }, [title]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [content, isEditing]);

  // 1. Initial Load Logic
  useEffect(() => {
    if (id !== "new") {
      // 1. SEARCH GLOBALLY: Look through every folder, not just the active one
      let foundNote = null;
      let parentBoksId = null;

      for (const boks of bokses) {
        const note = boks.notes.find((n) => 
          n.id === id || n.id.toLowerCase() === id.toLowerCase()
        );
        if (note) {
          foundNote = note;
          parentBoksId = boks.id;
          break;
        }
      }

      if (foundNote) {
        // 2. NOTE EXISTS! Load the content immediately.
        setTitle(foundNote.title);
        setContent(foundNote.content);
        setType(foundNote.type || "permanent");
        setTags(foundNote.tags ? foundNote.tags.join(", ") : "");
        setLinks(foundNote.links || []);
        
        // Ensure they see the text (don't force edit mode if it already has content)
        setIsEditing(false); 
      } else {
        // 3. NOTE TRULY DOES NOT EXIST YET: Clear screen to write
        const formattedTitle = id
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        setTitle(formattedTitle);
        setContent("");
        setType("fleeting");
        setTags("");
        setLinks([]);
        setIsEditing(true);
      }
    } else {
      // New Note from Sidebar
      setTitle("");
      setContent("");
      setType("permanent");
      setTags("");
      setLinks([]);
      setIsEditing(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSave = (silent = false) => {
    if (!title.trim()) return;

    const slugify = (str) =>
      str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "");

    const isTimestampId = /^\d{13}(-\d+)?$/.test(id);
    const isTemporary = id === "new" || isTimestampId;
    const noteId = isTemporary ? slugify(title) : id;

    const noteData = {
      id: noteId,
      title,
      content,
      type,
      links,
      tags: tags.split(",").map((t) => t.trim()).filter((t) => t !== ""),
      dateCreated: notes.find((n) => n.id === id)?.dateCreated || new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    saveNote(noteData);

    if (isTimestampId && noteId !== id) {
      deleteNote(id);
    }

    if (id !== noteId) {
      navigate(`/note/${noteId}`, { replace: true });
    }
  };

  useEffect(() => {
    if (!title.trim()) return;

    const timer = setTimeout(() => {
      setIsSaving(true);
      handleSave(true);
      setTimeout(() => setIsSaving(false), 1500); 
    }, 1500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, tags, links, type]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this Zettel?")) {
      deleteNote(id);
      navigate("/");
    }
  };


  const ref = useRef(null);

const handleChange = (e) => {
  setTitle(e.target.value);
  const el = ref.current;
  if (el) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }
};

  return (
    <motion.div
      // FIX #2: Adding key={id} is the ultimate bug killer. 
      // It forces React to completely destroy the old page and build a fresh one on every click.
      key={id} 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto pb-20"
    >
      {/* Top Navigation / Actions */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/")}
          className="text-slate-400 hover:text-slate-800 flex items-center gap-2 transition-colors"
        >
          <ChevronLeft size={20} /> Back to Desk
        </button>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setIsEditing(true)}
              className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-xs font-bold transition-all ${isEditing ? "bg-white shadow-sm text-amber-700" : "text-slate-500"}`}
            >
              <Edit3 size={14} /> EDIT
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-xs font-bold transition-all ${!isEditing ? "bg-white shadow-sm text-amber-700" : "text-slate-500"}`}
            >
              <Eye size={14} /> PREVIEW
            </button>
          </div>

          <button
            onClick={() => {
              handleSave();
              navigate("/");
            }}
            className="bg-slate-900 text-white px-6 py-2 rounded-full hover:bg-slate-800 shadow-lg active:scale-95 transition-all text-sm font-medium"
          >
            Done
          </button>
        </div>
      </div>

      {/* The Paper Component */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl transition-colors">
        <div className="p-10 md:p-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">
                ID: {id === "new" || /^\d{13}(-\d+)?$/.test(id) ? "New Zettel" : id}
              </span>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-1 rounded border-none outline-none cursor-pointer hover:bg-amber-100 transition-colors"
              >
                <option value="permanent">Permanent</option>
                <option value="literature">Literature</option>
                <option value="fleeting">Fleeting</option>
              </select>
            </div>

            <AnimatePresence>
              {isSaving && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] text-emerald-600 font-bold flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> AUTOSAVED
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <textarea
            ref={titleRef}
            placeholder="A clear, concise title..."
            className="w-full text-5xl font-serif font-bold bg-transparent dark:text-white outline-none mb-4 resize-none overflow-hidden leading-tight"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              // Prevent actual "Enter" key newlines in the title, we only want wrapping!
              if (e.key === 'Enter') e.preventDefault();
            }}
            rows={1}
          />

          <div className="flex items-center gap-2 mb-12 text-slate-400">
            <span className="text-sm font-bold text-slate-300">#</span>
            <input
              type="text"
              placeholder="tags, separated, by, commas"
              className="text-sm outline-none w-full italic bg-transparent focus:text-slate-600 transition-colors"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {isEditing ? (
            <textarea
              ref={textareaRef}
              placeholder="Start your thought here using Markdown..."
              className="w-full p-8 text-xl text-slate-700 dark:text-slate-200 bg-slate-50/30 dark:bg-slate-950/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-amber-200 dark:focus:border-amber-500/50"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          ) : (
            <div className="min-h-[65vh] py-4">
              <MarkdownRenderer
                content={content || "_No content yet. Click edit to start writing._"}
              />
            </div>
          )}

          <div className="mt-16 pt-10 border-t border-slate-100 space-y-12">
            <section>
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Related Connections
                </h4>
                <button
                  onClick={() => setShowPicker(!showPicker)}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 underline underline-offset-4 decoration-2"
                >
                  {showPicker ? "Close Search" : "+ Find Link"}
                </button>
              </div>

              {showPicker && (
                <LinkPicker
                  currentNoteId={id}
                  onSelect={(target) => setLinks([...links, target])}
                  existingLinks={links}
                />
              )}

              <div className="flex flex-wrap gap-3 mt-4">
                {links.map((linkId) => {
                  const linkedNote = notes.find((n) => n.id === linkId);
                  return (
                    <div
                      key={linkId}
                      className="relative group"
                      onMouseEnter={() => setHoveredNote(linkedNote)}
                      onMouseLeave={() => setHoveredNote(null)}
                    >
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 pl-3 pr-2 py-1.5 rounded-lg text-sm text-slate-700 group-hover:border-amber-200 group-hover:bg-amber-50 transition-all">
                        <span className="font-medium truncate max-w-[150px]">
                          {linkedNote?.title || linkId}
                        </span>
                        <button
                          onClick={() => setLinks(links.filter((l) => l !== linkId))}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                      {hoveredNote?.id === linkId && (
                        <div className="absolute bottom-full left-0 mb-3 z-50">
                          <NotePreview note={hoveredNote} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {backlinks.length > 0 && (
              <section>
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                  Referenced By
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {backlinks.map((bn) => (
                    <button
                      key={bn.id}
                      onClick={() => navigate(`/note/${bn.id}`)}
                      className="text-left p-4 rounded-xl border border-slate-100 bg-white hover:border-amber-200 hover:shadow-md transition-all group"
                    >
                      <div className="text-sm font-bold text-slate-800 group-hover:text-amber-700">
                        {bn.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1 uppercase">
                        {bn.type}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {id !== "new" && (
        <div className="mt-20 pt-10 border-t border-red-50 flex justify-center">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-slate-300 hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <Trash2 size={14} /> Delete this individual note
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default NoteDetail;