import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useNoteStore = create(
  persist(
    (set, get) => ({
      bokses: [
        { id: 'tutorial', name: 'Tutorial Boks', notes: [
  {
    "id": "101",
    "title": "Welcome to Noteboks",
    "type": "permanent",
    "content": "## Your New Second Brain\nWelcome! This is a **Boks**—a collection of interconnected thoughts. Unlike a standard note app, Noteboks is designed for *Zettelkasten*, a method where notes gain value by being linked together.\n\n### Quick Start\n1. **Read**: Browse these tutorial notes.\n2. **Link**: Notice the amber IDs like [[102]]. Click them to jump between thoughts.\n3. **Graph**: Check the **Knowledge Map** in the sidebar to see how these notes are connected.\n\nStart by learning about the three types of notes in [[102]].",
    "links": ["102"],
    "tags": ["welcome", "start-here"],
    "dateCreated": "2026-04-06T10:00:00Z"
  },
  {
    "id": "102",
    "title": "Three Types of Notes",
    "type": "permanent",
    "content": "## Categorizing Your Thoughts\nIn Noteboks, you can label notes to manage their lifecycle:\n\n* **Fleeting**: Raw, unprocessed ideas. Temporary.\n* **Literature**: Summaries of things you've read or watched. See [[105]] for an example.\n* **Permanent**: Polished, atomic ideas written in your own words. These are the gold in your Boks.\n\nLearn how to create a connection in [[103]].",
    "links": ["103", "105"],
    "tags": ["methodology", "basics"],
    "dateCreated": "2026-04-06T10:05:00Z"
  },
  {
    "id": "103",
    "title": "Creating WikiLinks",
    "type": "permanent",
    "content": "## The Power of [[ ]]\nYou create connections by using double brackets. \n\nWhen you type `[[` followed by a note ID, Noteboks turns it into a clickable link. This mirrors how the brain associates ideas through context rather than folders.\n\n### Try this:\nGo to **Edit Mode** on this note. You'll see this link to [[104]]. In **Preview Mode**, it becomes a portal to that note.",
    "links": ["104"],
    "tags": ["tutorial", "features"],
    "dateCreated": "2026-04-06T10:10:00Z"
  },
  {
    "id": "104",
    "title": "The Art of Backlinks",
    "type": "permanent",
    "content": "## Seeing the Reverse\nScroll to the bottom of this note. You will see a section called **'Referenced By'**.\n\nBecause [[103]] points here, this note automatically knows it is being referenced. This 'bi-directional' nature ensures that no thought is ever lost in the archives. You can always find your way back to the source.",
    "links": [],
    "tags": ["backlinks", "serendipity"],
    "dateCreated": "2026-04-06T10:15:00Z"
  },
  {
    "id": "105",
    "title": "Example: Literature Note",
    "type": "literature",
    "content": "## Source: How to Take Smart Notes\n**Author:** Sönke Ahrens\n\n### Summary\nThe slip-box (Zettelkasten) is not a mechanism to save notes, but a system to think in. Writing is the only way to check if we actually understand a concept. \n\n> 'The key is to make smart notes, not just notes.'\n\nThis connects to the idea of **Atomic Notes** in [[106]].",
    "links": ["106"],
    "tags": ["books", "learning"],
    "dateCreated": "2026-04-06T10:20:00Z"
  },
  {
    "id": "106",
    "title": "Atomic Notes",
    "type": "permanent",
    "content": "## Keep it Small\nAn 'Atomic Note' means one note contains **exactly one idea**.\n\nWhy? Because if a note is too long and covers five topics, it's hard to link to it specifically. Small notes act like Lego bricks—you can combine them in infinite ways to build a complex essay or project.\n\nSee how these look in the [[107]].",
    "links": ["107"],
    "tags": ["writing", "philosophy"],
    "dateCreated": "2026-04-06T10:25:00Z"
  },
  {
    "id": "107",
    "title": "The Knowledge Map",
    "type": "permanent",
    "content": "## Visualizing Your Brain\nThe **Knowledge Map** in the sidebar isn't just a gimmick. It helps you find 'clusters' of thought. \n\nIf you see a group of notes that are heavily linked, that's a sign that you have a lot of expertise in that area. If a note is floating alone, it might be time to find a connection for it in [[101]].",
    "links": ["101"],
    "tags": ["graph", "visualization"],
    "dateCreated": "2026-04-06T10:30:00Z"
  },
  {
    "id": "108",
    "title": "Auto-Saving and Settings",
    "type": "fleeting",
    "content": "## Don't Forget to Export\nNoteboks auto-saves your work to your browser's local storage. However, if you clear your browser cache, you could lose your data.\n\n**Action Item:** Periodically go to **Settings** and 'Export JSON' to keep a backup of your Noteboks on your computer. You can always re-import it later!",
    "links": [],
    "tags": ["meta", "safety"],
    "dateCreated": "2026-04-06T10:35:00Z"
  }
] } // Default Tutorial Boks
      ],
      currentBoksId: 'tutorial',

      // Boks Management
      setCurrentBoks: (id) => set({ currentBoksId: id }),
      
      addBoks: (name) => set((state) => ({
        bokses: [...state.bokses, { id: Date.now().toString(), name, notes: [] }]
      })),

      deleteBoks: (id) => set((state) => ({
        bokses: state.bokses.filter(b => b.id !== id),
        currentBoksId: state.bokses[0]?.id || null // Fallback to first boks
      })),

      // Note Management (Nested within current Boks)
      saveNote: (updatedNote) => set((state) => {
        const newBokses = state.bokses.map(boks => {
          if (boks.id === state.currentBoksId) {
            const noteIndex = boks.notes.findIndex(n => n.id === updatedNote.id);
            const newNotes = [...boks.notes];
            if (noteIndex > -1) newNotes[noteIndex] = updatedNote;
            else newNotes.unshift(updatedNote);
            return { ...boks, notes: newNotes };
          }
          return boks;
        });
        return { bokses: newBokses };
      }),

      deleteNote: (noteId) => set((state) => ({
        bokses: state.bokses.map(boks => 
          boks.id === state.currentBoksId 
            ? { ...boks, notes: boks.notes.filter(n => n.id !== noteId) }
            : boks
        )
      })),
      
      // JSON Import/Export
      importBoks: (data) => set((state) => ({
        bokses: [...state.bokses, data]
      })),
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    { name: 'noteboks-storage' }
  )
);

export default useNoteStore;