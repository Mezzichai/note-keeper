import React, {useState, useEffect} from 'react'
import Header from './components/header/Header';
import Notes from './components/main/Notes';
import Sidebar from './components/sidebar/Sidebar'
import './App.css'
import api from './api/axios';
import { Context } from './context';
import { NoteType } from './interfaces';
import { LabelType } from './interfaces';
import { notesState } from './interfaces';


const App: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [currentLabel, setCurrentLabel] = useState<LabelType>({title: "Notes", _id: "default"});
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const [notes, setNotes] = useState<notesState>({
    plainNotes: [],
    pinnedNotes: [],
  });
  const [labels, setLabels] = useState<LabelType[]>([])
  const [multiSelectMode, setMultiSelectMode] = useState<boolean>(false)
  const [selectedNotes, setSelectedNotes] = useState<NoteType[]>([])
  const [loading, setLoading] = useState<boolean>(true)



  useEffect(() => {
    const getNotes = async () => {
      try {
        const response = await api.get(`./notes/${JSON.stringify(currentLabel)}`);
        console.log(response)
        setNotes(() => ({ plainNotes: response.data.plainNotes, pinnedNotes: response.data.pinnedNotes }));
        setLoading(false)
    } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
    getNotes()
  }, [currentLabel]);


  useEffect(() => {
   console.log(notes)
  }, [notes]);

  const context = {
    notes: notes,
    setNotes: setNotes,
    currentLabel: currentLabel,
    selectedNotes: selectedNotes,
    setSelectedNotes: setSelectedNotes,
    multiSelectMode: multiSelectMode,
    setMultiSelectMode: setMultiSelectMode,
    labels: labels,
    setLabels: setLabels,
    loading: loading
  }

  return (
    <>
      <Context.Provider value={context}>
        <Header isOpen={isOpen} setIsOpen={setIsOpen} query={query} setQuery={setQuery}/>
        <div className="container">
          <Sidebar isOpen={isOpen} setCurrentLabel={setCurrentLabel} />
          <Notes notes={notes}/>
        </div>
      </Context.Provider>
    </>
  )
}

export default App
