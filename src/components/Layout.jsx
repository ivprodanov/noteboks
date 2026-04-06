import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Settings, 
  LayoutGrid, 
  PlusCircle, 
  Share2, 
  Plus, 
  Folder, 
  Trash2,
  Sun, Moon
} from 'lucide-react';
import useNoteStore from '../store/useNoteStore';

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
        {/* Branding */}
        <div className="p-6">
          <h1 className="text-2xl font-serif font-black text-amber-600 tracking-tighter">Noteboks</h1>
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
              className="p-1 hover:bg-amber-50 rounded text-slate-400 hover:text-amber-600 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          
          <div className="space-y-1">
            {bokses.map(boks => (
              <div key={boks.id} className="group flex items-center justify-between">
               <button
  onClick={() => setCurrentBoks(boks.id)}
  className={`flex items-center gap-3 px-3 py-2 rounded-lg flex-1 text-sm transition-all text-left truncate ${
    currentBoksId === boks.id 
      ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold shadow-sm' 
      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
  }`}
>
  <Folder size={16} className={currentBoksId === boks.id ? 'text-amber-500' : 'text-slate-400'} />
  <span className="truncate">{boks.name}</span>
</button>

                {/* Don't allow deleting the tutorial boks */}
                {boks.id !== 'tutorial' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if(confirm(`Delete ${boks.name} and all its notes?`)) deleteBoks(boks.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>v1.0.0-beta</span>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
  <button 
    onClick={toggleDarkMode}
    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
  >
    {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
  </button>
  <span className="text-[10px] text-slate-400 font-mono italic">Noteboks v1.0</span>
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
    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
      active 
        ? 'bg-slate-900 text-white shadow-md' 
        : 'hover:bg-slate-100 text-slate-600'
    }`}
  >
    <span className={active ? 'text-amber-400' : 'text-slate-400'}>{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

export default Layout;