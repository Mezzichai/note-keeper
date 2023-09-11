import React, {useRef, useEffect, useState, useContext, useLayoutEffect} from 'react'
import MainStyles from './MainStyles.module.css'
import NoteStyles from './NoteStyles.module.css'
import api from '../../api/axios';
import { Context } from '../../context/context';

interface Label {
  _id?: string;
  title: string;
}
interface note {
  _id: string;
  title?: string;
  body?: string;
  labels: Label[];
}

interface Props {
  noteState: boolean;
  setNoteState: React.Dispatch<React.SetStateAction<boolean>>;
  note: note
}


const NoteModal: React.FC<Props> = ({setNoteState, noteState, note}) => {

  const {setNotes} = useContext(Context)
  const [title, setTitle] = useState<string>(`${note.title}`)
  const [body, setBody] = useState<string>(`${note.body}`)


  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value)

    e.target.style.height = "auto"; // Reset the height to auto
    e.target.style.height = `${e.target.scrollHeight}px`; // Set the new height
  }


  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }


  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (textareaRef.current) {
      // Calculate the scroll height of the textarea content
      const scrollHeight = textareaRef.current.scrollHeight;
      // Set the textarea height to the scroll height
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [note.body]); // Recalculate height whenever the note body changes

  useLayoutEffect(() => {
    if (titleInputRef.current) {
      // Calculate the scroll height of the textarea content
      const content = titleInputRef.current.scrollHeight;
      // Set the textarea height to the scroll height
      titleInputRef.current.style.height = `${Math.min(content, 100)}px`;    }
  }, [note.title]);


  const divRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        setTimeout(()=> {
          if (divRef.current && !divRef.current.contains(event.target as Node)) {
            handleBlur();
          }
        }, 100)
      };
  
    if (noteState) {
        document.addEventListener("mousedown", handleClickOutside);
    } 
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [title, body]);

  
  const patchAndUpdateNotes = async () => {
    const response = await api.patch(`./notes/${note._id}`,
    JSON.stringify({body: body , title: title}),
    {
      headers: { "Content-Type": "application/json"},
      withCredentials: true
    })
    const updatedNote = response.data

    setNotes((prevNotes) => {
      return {
        plainNotes: prevNotes.plainNotes.map(prevNote => prevNote._id === updatedNote._id ? updatedNote : prevNote),
        pinnedNotes: prevNotes.pinnedNotes.map(prevNote => prevNote._id === updatedNote._id ? updatedNote : prevNote),
      }
    })
  }
    
  const handleBlur = async () => {
    console.log("blurring!")
    if (title !== note.title || body !== note.body) {
      await patchAndUpdateNotes()
    }
    setNoteState(false)
  }


  return (
    <div className={NoteStyles.modal} ref={divRef}>
      <input 
        className={MainStyles.titleInput}
        placeholder='Title'
        type="text" 
        value={title}
        ref={titleInputRef}
        onChange={(e) => handleTitleChange(e)}
        // onBlur={() => handleBlur()}
      />
      <textarea
        placeholder='Take a note...'
        className={NoteStyles.bodyInput}
        value={body}
        ref={textareaRef}
        // onBlur={() => handleBlur()}
        onChange={(e)=>handleBodyChange(e)}
      />
    </div>
  )
}

export default NoteModal