import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NoteDetail from './components/NoteDetail';
import Settings from './pages/Settings';

// Optional: For beautiful page transitions
import { AnimatePresence } from 'framer-motion';
import GraphViewPage from './pages/GraphViewPage';
import useNoteStore from './store/useNoteStore';
import { useEffect } from 'react';

function App() {
  const darkMode = useNoteStore((state) => state.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        {/* We wrap routes in a Layout to keep Sidebar/Nav consistent */}
        <Route path="/" element={<Layout />}>
          
          {/* Default view: The Grid of Notes */}
          <Route index element={<Dashboard />} />
          
          {/* Individual Note View: Supports creating new or editing existing */}
          <Route path="note/:id" element={<NoteDetail />} />
          
          {/* Import/Export and App Preferences */}
          <Route path="settings" element={<Settings />} />
          <Route path="graph" element={<GraphViewPage />} />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;