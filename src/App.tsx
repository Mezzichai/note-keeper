import React, {useState} from 'react'
import Header from './components/header/Header';
import Notes from './components/main/Notes';
import Sidebar from './components/sidebar/Sidebar'
import './App.css'

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <>
      <Header isOpen={isOpen} setIsOpen={setIsOpen}/>
      <div className="container">
        <Sidebar isOpen={isOpen} />
        <Notes />
      </div>
    </>
  )
}

export default App
