import { createContext, useState, useContext } from "react";
import { NoteType,  notesState } from "../interfaces";

interface NoteProviderProps {
  children: React.ReactNode;
}


interface ContextType {
  notes: notesState;
  setNotes: React.Dispatch<React.SetStateAction<notesState>>;
  selectedNotes: NoteType[];
  setSelectedNotes: React.Dispatch<React.SetStateAction<NoteType[]>>;
  multiSelectMode: boolean;
  setMultiSelectMode: React.Dispatch<React.SetStateAction<boolean>>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  updateLocalNote: (note: NoteType) => void;
  createLocalNote: (note: NoteType) => void;
  deleteLocalNote: (note: NoteType) => void
  updateLocalNoteLabels: (note: NoteType) => void;
}

const NoteContext = createContext({} as ContextType);

const useNotes = () => {
  return useContext(NoteContext)
}

const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<notesState>({
    plainNotes: [],
    pinnedNotes: [],
  });
  const [multiSelectMode, setMultiSelectMode] = useState<boolean>(false);
  const [selectedNotes, setSelectedNotes] = useState<NoteType[]>([]);
  const [query, setQuery] = useState<string>("")


  function updateLocalNote(note: NoteType) {
    setNotes(prevNotes => {
      if (note.isPinned) {
        const newPlainNotes = prevNotes.plainNotes.filter(prevNote => prevNote._id !== note._id)
        return {
          plainNotes: newPlainNotes,
          pinnedNotes: [note, ...prevNotes.pinnedNotes],
        }
      } else {
        const newPinnedNotes = prevNotes.pinnedNotes.filter(prevNote => prevNote._id !== note._id)
        return {
          plainNotes: [note, ...prevNotes.plainNotes],
          pinnedNotes: newPinnedNotes,
        }
      }
    })
  }

  function updateLocalNoteLabels(note: NoteType) {
    setNotes(prevNotes => {
      if (note.isPinned) {
        const newPinnedNotes = prevNotes.pinnedNotes.map(prevNote => {
          return prevNote._id !== note._id ? prevNote : note
        })
        return {
          ...prevNotes,
          pinnedNotes: newPinnedNotes,
        }
      } else {
        const newPlainNotes = prevNotes.plainNotes.map(prevNote => {
          return prevNote._id !== note._id ? prevNote : note
        })
        return {
          ...prevNotes,
          plainNotes: newPlainNotes,
        }
      }
    })
  }

  function createLocalNote(note: NoteType) {
    setNotes(prevNotes => { 
      return {
        ...prevNotes,
        plainNotes: [note ,...prevNotes.plainNotes]
      }
    })
  }

  function deleteLocalNote(note: NoteType) {
    setNotes(prevNotes => {
      if (note?.isPinned) {
        const newPinnedNotes = prevNotes.pinnedNotes.filter(prevNote => prevNote._id !== note._id) 
        return {
          ...prevNotes,
          pinnedNotes: newPinnedNotes
        }
      } else {
        const newPlainNotes = prevNotes.plainNotes.filter(prevNote => prevNote._id !== note._id) 
        return {
          ...prevNotes,
          plainNotes: newPlainNotes
        }
      }
    })
  }

  const context: ContextType = {
    notes,
    setNotes,
    selectedNotes,
    setSelectedNotes,
    multiSelectMode,
    setMultiSelectMode,
    query,
    setQuery,
    updateLocalNote,
    createLocalNote,
    deleteLocalNote,
    updateLocalNoteLabels,
  };

  return (
    <NoteContext.Provider value={context}>
      {children}
    </NoteContext.Provider>
  );
};

export { NoteProvider, useNotes};