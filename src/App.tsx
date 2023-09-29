import React, { useEffect }  from 'react'
import Header from './components/header/Header';
import Notes from './components/main/Notes';
import Sidebar from './components/sidebar/Sidebar'
import './App.css'
import { NoteProvider } from './context/NoteContext';
import { LabelProvider } from './context/LabelContext';
import { Routes, Route, useNavigate} from 'react-router-dom'


const App: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/Notes`);
  }, [])

  return (
    <>
      <AppProvider>
      <Header />
        <Routes>
          <Route path='/:labelId' element={
              <div className="container">
                <Sidebar />
                <NoteProvider>
                  <Notes/>
                </NoteProvider>
              </div>
          } />
        </Routes>
      </AppProvider>
    </>
  )
}

export default App
