import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Settings, 
  LayoutGrid, 
  PlusCircle, 
  Share2, 
  Plus, 
  Folder, 
  Trash2,
  Sun, Moon,
  FileText
} from 'lucide-react';
import useNoteStore from '../store/useNoteStore';
import { exportBoksToPdf } from '../utils/pdfExport';

const Layout = () => {
  const location = useLocation();
  const { bokses, currentBoksId, setCurrentBoks, addBoks, deleteBoks } = useNoteStore();

  const handleNewBoks = () => {
    const name = prompt("Name your new Boks:");
    if (name) addBoks(name);
  };

  const { darkMode, toggleDarkMode } = useNoteStore();

  return (
    <div className="flex h-screen bg-[#f5f5f4] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full">
        {/* Branding: Creative Text-Logo */}
<div className="p-6 mb-2">
  <Link to="/" className="group flex items-center gap-2.5 no-underline">
    <div className="relative flex items-center justify-center">
      {/* The "Boks" - decorative background layers */}
      <div className="w-8 h-8 bg-amber-500 rounded-lg rotate-3 group-hover:rotate-6 transition-transform duration-300 shadow-sm" />
      <div className="absolute inset-0 w-8 h-8 bg-slate-900 dark:bg-amber-100 rounded-lg -rotate-3 group-hover:-rotate-12 transition-transform duration-300 shadow-md flex items-center justify-center border-2 border-amber-500">
        <span className="text-white dark:text-amber-600 font-serif font-black text-lg">N</span>
      </div>
    </div>
    
    <div className="flex flex-col -space-y-1.5">
      <h1 className="text-xl font-serif font-black text-slate-800 dark:text-white tracking-tighter uppercase italic">
        Note<span className="text-amber-600">boks</span>
      </h1>
      <span className="text-[9px] font-mono font-bold text-amber-500/80 tracking-[0.2em] uppercase pl-0.5">
        Second Brain
      </span>
    </div>
  </Link>
</div>

        {/* Primary Navigation */}
        <nav className="px-4 space-y-1 mb-8">
          <SidebarLink 
            to="/" 
            icon={<LayoutGrid size={18} />} 
            label="My Desk" 
            active={location.pathname === '/'} 
          />
          <SidebarLink 
            to="/note/new" 
            icon={<PlusCircle size={18} />} 
            label="New Zettel" 
            active={location.pathname === '/note/new'} 
          />
          <SidebarLink 
            to="/graph" 
            icon={<Share2 size={18} />} 
            label="Knowledge Map" 
            active={location.pathname === '/graph'} 
          />
          <SidebarLink 
            to="/settings" 
            icon={<Settings size={18} />} 
            label="Settings" 
            active={location.pathname === '/settings'} 
          />
        </nav>

        {/* Bokses Section */}
        <div className="flex-1 px-4 overflow-y-auto">
          <div className="flex justify-between items-center px-2 mb-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Collections</h3>
            <button 
              onClick={handleNewBoks} 
              title="Create New Boks"
              className="p-1 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded text-slate-400 hover:text-amber-600 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          
          <div className="space-y-1">
            {bokses.map(boks => (
              <div key={boks.id} className="group flex items-center justify-between gap-1">
                <button
                  onClick={() => setCurrentBoks(boks.id)}
                  title={`Open ${boks.name}`} // Native Tooltip
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg flex-1 text-sm transition-all text-left truncate relative ${
                    currentBoksId === boks.id 
                      ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold shadow-sm' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {/* Fixed Icon Size with shrink-0 */}
                  <Folder 
                    size={16} 
                    className={`shrink-0 ${currentBoksId === boks.id ? 'text-amber-500' : 'text-slate-400'}`} 
                  />
                  <span className="truncate">{boks.name}</span>
                </button>
<button 
      onClick={(e) => {
        e.stopPropagation();
        exportBoksToPdf(boks);
      }}
      title="Export Boks to PDF"
      className="p-1.5 text-slate-400 hover:text-amber-600"
    >
      <FileText size={14} />
    </button>
                {/* Delete Button with Tooltip */}
                {boks.id !== 'tutorial' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if(confirm(`Delete ${boks.name} and all its notes?`)) deleteBoks(boks.id);
                    }}
                    title="Delete Collection"
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button 
            onClick={toggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-[10px] text-slate-400 font-mono italic">
               <span>v1.0.0-beta</span>
               <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// Helper component for sidebar links
const SidebarLink = ({ to, icon, label, active }) => (
  <Link
    to={to}
    title={label}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
      active 
        ? 'bg-slate-900 dark:bg-amber-600 text-white shadow-md' 
        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
    }`}
  >
    <span className={`shrink-0 ${active ? 'text-amber-400 dark:text-white' : 'text-slate-400'}`}>{icon}</span>
    <span className="text-sm font-medium truncate">{label}</span>
  </Link>
);

export default Layout;