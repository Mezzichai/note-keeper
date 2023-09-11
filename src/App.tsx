import React, {useState, useEffect} from 'react'
import Header from './components/header/Header';
import Notes from './components/main/Notes';
import Sidebar from './components/sidebar/Sidebar'
import './App.css'
import api from './api/axios';
import { Context } from './context/context';
import { NoteType } from './interfaces';
import { LabelType } from './interfaces';
import { notesState } from './interfaces';
import { useAuth0 } from '@auth0/auth0-react'

const App: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [currentLabel, setCurrentLabel] = useState<LabelType>({title: "Notes", _id: "default"});
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [theme, setTheme] = useState("dark")
  const [notes, setNotes] = useState<notesState>({
    plainNotes: [],
    pinnedNotes: [],
  });
  const [labels, setLabels] = useState<LabelType[]>([])
  const [multiSelectMode, setMultiSelectMode] = useState<boolean>(false)
  const [selectedNotes, setSelectedNotes] = useState<NoteType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { isLoading, error } = useAuth0()


  useEffect(() => {
    if (currentLabel.title !== "Query") {
      const getNotes = async () => {
        try {
          const response = await api.get(`./notes/${JSON.stringify(currentLabel)}`);
          setNotes(() => ({ plainNotes: response.data.plainNotes, pinnedNotes: response.data.pinnedNotes }));
          setLoading(false)
      } catch (error) {
          console.error('Error fetching notes:', error);
        }
      };
      getNotes()
    }
  }, [currentLabel]);


  const context = {
    notes: notes,
    setNotes: setNotes,
    currentLabel: currentLabel,
    setCurrentLabel: setCurrentLabel,
    selectedNotes: selectedNotes,
    setSelectedNotes: setSelectedNotes,
    multiSelectMode: multiSelectMode,
    setMultiSelectMode: setMultiSelectMode,
    labels: labels,
    setLabels: setLabels,
    loading: loading,
    setLoading: setLoading,
    setTheme: setTheme,
    theme: theme
  }

  return (
    <>
      <Context.Provider value={context}>
        {error && <p className="auth-msg">Authentication Error</p>}
        {!error && isLoading && <p className="auth-msg">Loading...</p>}
        {!error && !isLoading &&
        <>
         <Header isOpen={isOpen} setIsOpen={setIsOpen} query={query} setQuery={setQuery}/>
         <div className="container">
           <Sidebar isOpen={isOpen} setCurrentLabel={setCurrentLabel} />
           <Notes notes={notes} />
         </div>
         </>
        }

       
      </Context.Provider>
    </>
  )
}

export default App
