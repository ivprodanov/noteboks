import useNoteStore from '../store/useNoteStore';
import { exportToJson, importFromJson } from '../utils/fileSystem';
import { Download, Upload, Trash2 } from 'lucide-react';

const Settings = () => {
  const { notes, importNotes, clearAll } = useNoteStore();

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await importFromJson(file);
      importNotes(data);
      alert('Notes imported successfully!');
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-serif font-bold mb-8">Settings & Data</h2>
      
      <div className="space-y-6">
        {/* Export Section */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Backup Your Brain</h3>
          <p className="text-slate-500 text-sm mb-4">Download all your notes as a single JSON file for safe keeping.</p>
          <button 
            onClick={() => exportToJson(notes)}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Download size={18} /> Export JSON
          </button>
        </section>

        {/* Import Section */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Import Data</h3>
          <p className="text-slate-500 text-sm mb-4">Restore notes from a previous JSON export.</p>
          <label className="flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 px-4 py-2 rounded-lg hover:bg-amber-100 cursor-pointer transition-colors w-fit">
            <Upload size={18} /> Import JSON
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-50 p-6 rounded-xl border border-red-100 mt-12">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Danger Zone</h3>
          <p className="text-red-600/70 text-sm mb-4">This will permanently delete all notes in your current local storage.</p>
          <button 
            onClick={() => window.confirm('Are you sure?') && clearAll()}
            className="flex items-center gap-2 text-red-700 font-medium hover:text-red-800 transition-colors"
          >
            <Trash2 size={18} /> Clear all notes
          </button>
        </section>
      </div>
    </div>
  );
};

export default Settings;