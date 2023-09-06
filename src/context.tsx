import { createContext } from "react"
import { NoteType, LabelType, notesState } from "./interfaces";


interface ContextType {
  notes: notesState;
  setNotes: React.Dispatch<React.SetStateAction<notesState>>;
  currentLabel: LabelType;
  selectedNotes: NoteType[];
  setSelectedNotes: React.Dispatch<React.SetStateAction<NoteType[]>>;
  multiSelectMode: boolean;
  setMultiSelectMode: React.Dispatch<React.SetStateAction<boolean>>;
  labels: LabelType[];
  setLabels: React.Dispatch<React.SetStateAction<LabelType[]>>;
  loading: boolean;
}

export const Context = createContext<ContextType>({} as ContextType)