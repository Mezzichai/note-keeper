import React, {useState, useRef, useEffect, useContext} from 'react'
import MainStyles from './MainStyles.module.css'
import api from '../../api/axios';
import { Context } from '../../context/context';

// interface NoteProps {
//   _id: string;
//   title?: string;
//   body?: string;
//   label: string;

// }

// interface Props {
//   notes: NoteProps[]
// }
const Create: React.FC = () => {

  
  const [title, setTitle] = useState<string>("")
  const [body, setBody] = useState<string>("")
  const {currentLabel, setNotes} = useContext(Context)

  const [newNoteState, setNewNoteState] = useState<boolean>(false)

  const postNote = async () => {
    return await api.post(`./notes/newnote`, 
    JSON.stringify({
      title: title,
      body: body,
      isTrashed: false,
      isArchived: false,
      isPinned: false,
      labels: [currentLabel]
    }), {
      headers: {"Content-Type": "application/json"},
      withCredentials: true
    })
  } 

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    //this is getting run instantly
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        handleBlur();
      }
    };
  
    if (newNoteState) {
        document.addEventListener("mousedown", handleClickOutside);
    } 
   
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    
  }, [newNoteState, title, body]);
  // PAY A-FUCKING-TTENTION TO THIS. 
  // you need the dependencies to have the most current state
  
  

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value)
    e.target.style.height = "auto"; // Reset the height to auto
    e.target.style.height = `${e.target.scrollHeight}px`; // Set the new height
  }





  const handleBlur = async () => {
    if (title || body) {
      const newNote = await postNote()
      setNotes((prevNotes) => ({plainNotes: [...prevNotes.plainNotes, newNote.data], pinnedNotes: prevNotes.pinnedNotes}))
      setTitle("")
      setBody("")
    }
   
    setNewNoteState(false)
  }


  return (
    <div ref={divRef} className={` ${MainStyles.newNote} ${newNoteState ? MainStyles.newNoteActive : MainStyles.newNoteInactive}`}>
      {newNoteState ? (
        <input 
          className={MainStyles.titleInput}
          placeholder='Title'
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      ) : null}
        <textarea
          placeholder='Take a note...'
          className={MainStyles.bodyInput}
          onFocus={() => setNewNoteState(true)}
          value={body}
          onChange={(e)=>handleBodyChange(e)}
      />
    </div>
  )
}

export default Create