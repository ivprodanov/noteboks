import { motion } from 'framer-motion';

const NotePreview = ({ note }) => {
  if (!note) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="absolute z-50 w-64 p-4 bg-white border border-amber-200 shadow-2xl rounded-lg pointer-events-none"
    >
      <div className="text-[10px] font-mono text-amber-600 mb-1 uppercase tracking-tighter">
        Preview: {note.id}
      </div>
      <h4 className="font-serif font-bold text-slate-800 mb-2 truncate">{note.title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-4 italic">
        "{note.content}"
      </p>
    </motion.div>
  );
};

export default NotePreview;