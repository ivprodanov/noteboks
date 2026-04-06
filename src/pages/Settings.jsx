import { useState } from 'react';
import useNoteStore from '../store/useNoteStore';
import { exportToJson } from '../utils/fileSystem';
import { Download, Upload, Trash2, ClipboardCheck, Copy, Sparkles, Send } from 'lucide-react';

const Settings = () => {
  // Destructure from store
  const { bokses, importBoks, clearAll, importBulk } = useNoteStore();
  const [jsonInput, setJsonInput] = useState("");
  const [copied, setCopied] = useState(false);

  // --- LOGIC: Paste Import ---
  const handlePasteImport = () => {
    if (!jsonInput.trim()) return alert("The input is empty! Please paste your JSON first.");

    try {
      const data = JSON.parse(jsonInput.trim());
      
      if (!data.id) throw new Error("Missing 'id' at the top level.");
      if (!data.name) throw new Error("Missing 'name' (Boks title).");
      if (!Array.isArray(data.notes)) throw new Error("'notes' must be an array.");

      importBoks(data);
      alert(`Successfully imported "${data.name}" with ${data.notes.length} notes!`);
      setJsonInput(""); // Clear after success
    } catch (err) {
      console.error("Import Error:", err);
      alert(`Import Failed: ${err.message}`);
    }
  };

  // --- LOGIC: File Upload Import ---
  const handleFileImport = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const result = event.target.result;

      // 1. Check if result is actually a string
      if (!result || typeof result !== 'string') {
        throw new Error("File content is empty or unreadable.");
      }

      // 2. Clean the string!
      // This removes invisible characters at the start (BOM) that cause the 'line 1' error
      const cleanJson = result.trim().replace(/^\uFEFF/, "");

      const data = JSON.parse(cleanJson);
      
      // 3. Handle Bulk (Array) or Single (Object)
      if (Array.isArray(data)) {
        importBulk(data);
        alert(`Bulk Import: Successfully restored ${data.length} Bokses!`);
      } else if (data && data.notes) {
        importBoks(data);
        alert(`Imported "${data.name}" successfully!`);
      } else {
        throw new Error("JSON structure not recognized.");
      }
    } catch (err) {
      console.error("Import Error:", err);
      // This alert will now show you if the data was actually missing
      alert(`Import Failed: ${err.message}`);
    }
  };

  // Explicitly read as text to avoid binary buffer issues
  reader.readAsText(file);
};

  const aiPrompt = `Act as a Zettelkasten Research Assistant. Summarize the provided text into a "Boks" JSON object for my 'Noteboks' app.
  
STRICT JSON STRUCTURE:
{
  "id": "${Date.now()}",
  "name": "Title of the Research",
  "notes": [
    { 
      "id": "unique_id", 
      "title": "...", 
      "type": "permanent|literature|fleeting", 
      "content": "Markdown text with [[ID]] links", 
      "links": ["id1"], 
      "tags": ["tag1"] 
    }
  ]
}

RULES:
1. Each note must be ATOMIC.
2. Cross-link notes using [[ID]] syntax within the content.
3. Output ONLY the valid JSON object.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(aiPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 pb-20">
      <header>
        <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-white">Settings & Tools</h2>
        <p className="text-slate-500 dark:text-slate-400">Manage your data and AI workflows.</p>
      </header>

      {/* 1. AI Prompt Section */}
      <section className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-500 rounded-lg text-white"><Sparkles size={20} /></div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-amber-100">AI Researcher Prompt</h3>
            <p className="text-xs text-amber-700/70 dark:text-amber-400/60">Copy this to tell an AI how to summarize PDFs for you.</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 relative">
          <pre className="text-[10px] text-slate-500 dark:text-slate-400 font-mono whitespace-pre-wrap leading-relaxed truncate h-12">
            {aiPrompt}
          </pre>
          <button onClick={handleCopy} className="absolute top-3 right-3 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md">
            {copied ? <ClipboardCheck size={14} /> : <Copy size={14} />}
            {copied ? "COPIED!" : "COPY PROMPT"}
          </button>
        </div>
      </section>

      {/* 2. AI Paste Import (The Missing Part) */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-semibold mb-2 dark:text-white">Paste AI Research</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Paste the JSON code generated by your AI here.</p>
        <textarea 
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="w-full h-48 p-4 mb-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xs dark:text-slate-300 outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
          placeholder='{ "id": "...", "name": "...", "notes": [...] }'
        />
        <button 
          onClick={handlePasteImport}
          className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-bold transition-all shadow-sm"
        >
          <Send size={18} /> Import from Textarea
        </button>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Section */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold mb-1 dark:text-white">Backup</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">Save all notes to a local file.</p>
          <button 
      // Pass 'bokses' instead of 'notes'
      onClick={() => exportToJson(bokses)} 
      className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg"
    >
      <Download size={18} /> Export JSON
    </button>
        </section>

        {/* File Import Section */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold mb-1 dark:text-white">File Upload</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">Restore from a .json file.</p>
          <label className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors w-full text-sm font-medium">
            <Upload size={18} /> Choose File
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>
        </section>
      </div>

      {/* Danger Zone */}
      <section className="bg-red-50 dark:bg-red-950/20 p-6 rounded-xl border border-red-100 dark:border-red-900/30">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-1">Danger Zone</h3>
        <p className="text-red-600/70 dark:text-red-400/60 text-xs mb-4">Permanently delete all notes in local storage.</p>
        <button 
  onClick={() => {
    if(window.confirm("This will wipe all Bokses and restore the tutorial. Proceed?")) {
      clearAll();
    }
  }}
  className="flex items-center gap-2 text-red-700 dark:text-red-400 font-medium"
>
  <Trash2 size={18} /> Wipe Library & Restart
</button>
      </section>
    </div>
  );
};

export default Settings;