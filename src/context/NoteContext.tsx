import { createContext, useEffect, useState, useContext } from "react";
import { NoteType,  notesState } from "../interfaces";
import { getNotes } from "../utils/notes";
import { useAsync } from "../hooks/useAsync";
import { useParams } from "react-router-dom";

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
  updateLocalNote: (note: NoteType) => void;
  createLocalNote: (note: NoteType) => void;
  deleteLocalNote: (note: NoteType) => void
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

  const { labelId } = useParams()
  
  const notesFromIdState = useAsync(() => getNotes(labelId), [labelId])


  useEffect(()=> {
    if (notesFromIdState?.data?.plainNotes) {
      setNotes(()=> {
        return {
          plainNotes: [...notesFromIdState.data.plainNotes],
          pinnedNotes: [...notesFromIdState.data.pinnedNotes],
        }
      })
    }
  }, [labelId, notesFromIdState?.data])


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
    updateLocalNote,
    createLocalNote,
    deleteLocalNote
  };

  return (
    <NoteContext.Provider value={context}>
     {notesFromIdState.loading ? (
        <h1>Loading</h1>
      ) : notesFromIdState.error ? (
        <h1 className="error-msg">{notesFromIdState.error.message}</h1> 
      ) : (
        <>
          {children}
        </>
      )}
    </NoteContext.Provider>
  );
};

export { NoteProvider, useNotes};