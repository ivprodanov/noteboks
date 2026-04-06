import { Outlet, Link, useLocation } from 'react-router-dom';
import { Book, Settings, LayoutGrid, PlusCircle } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#f5f5f4] text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-serif font-bold tracking-tight">SmartNotes</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SidebarLink to="/" icon={<LayoutGrid size={20} />} label="My Desk" active={location.pathname === '/'} />
          <SidebarLink to="/note/new" icon={<PlusCircle size={20} />} label="New Zettel" active={location.pathname === '/note/new'} />
          <SidebarLink to="/settings" icon={<Settings size={20} />} label="Settings & Sync" active={location.pathname === '/settings'} />
        </nav>
        
        <div className="p-4 border-t border-slate-100 text-xs text-slate-400 font-mono">
          v1.0.0-alpha
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {/* This is where the specific page components will render */}
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
    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
      active ? 'bg-amber-50 text-amber-700 font-medium' : 'hover:bg-slate-50 text-slate-600'
    }`}
  >
    {icon}
    {label}
  </Link>
);

export default Layout;