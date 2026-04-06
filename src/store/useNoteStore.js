import { create } from "zustand";
import { persist } from "zustand/middleware";

const useNoteStore = create(
  persist(
    (set, get) => ({
      notes: [],

      // Create or Update a note
      saveNote: (updatedNote) =>
        set((state) => {
          const index = state.notes.findIndex((n) => n.id === updatedNote.id);
          if (index > -1) {
            const newNotes = [...state.notes];
            newNotes[index] = updatedNote;
            return { notes: newNotes };
          }
          return { notes: [updatedNote, ...state.notes] };
        }),

      // Delete a note
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),

      // Bulk Import (The JSON functionality)
      importNotes: (jsonArray) => set({ notes: jsonArray }),

      // Clear all
      clearAll: () => set({ notes: [] }),

      getBacklinks: (noteId) => {
        const allNotes = get().notes;
        return allNotes.filter((n) => n.links && n.links.includes(noteId));
      },
    }),
    {
      name: "zettelkasten-storage", // Key for localStorage
    },
  ),
);

export default useNoteStore;
