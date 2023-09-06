import React, { useState, useRef, useLayoutEffect, useContext, useEffect } from 'react';
import NoteStyles from './NoteStyles.module.css';
import MainStyles from './MainStyles.module.css'
import NoteModal from './NoteModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faCheck, faEllipsisVertical, faMapPin, faTrash, faTrashRestore, faUndo } from '@fortawesome/free-solid-svg-icons';
import { Context } from '../../context';
import OptionsModal from './Multiselect-components/OptionsModal';
import api from '../../api/axios';
import UseUpdateNoteStatus from '../../hooks/HandleTrashAndArchive';
import { NoteType, notesState } from '../../interfaces';


interface Props {
  note: NoteType;
}

const Note: React.FC<Props> = ({ note }) => {
  const [noteState, setNoteState] = useState<boolean>(false);
  const [noteHoverState, setNoteHoverState] = useState<boolean>(false);
  const [optionsModalState, setOptionsModal] = useState<boolean>(false);
  const {setSelectedNotes, selectedNotes, setMultiSelectMode, multiSelectMode, setNotes, currentLabel} = useContext(Context)
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const optionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null)

  const [pinned, setPinned] = useState<boolean>(note.isPinned || false)

  useLayoutEffect(() => {
    if (textareaRef.current) {
      // Calculate the scroll height of the textarea content
      const scrollHeight = textareaRef.current.scrollHeight;
      // Set the textarea height to the scroll height
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [note.body]); // Recalculate height whenever the note body changes


  const handleFocus = () => {

    setNoteState(true);
  };


  const handleCheckClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (!multiSelectMode) {
      setMultiSelectMode(true)
    }
    if (selectedNotes.every(selectedNote => selectedNote._id !== note._id)) {
      setSelectedNotes([...selectedNotes, note])
    }
  }

  const handleOptionClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (!optionsModalState) {
      setOptionsModal(true)
    } 
  }

  const handlePinClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    console.log("pin click")
    api.patch(`./notes/${note._id}`, 
    JSON.stringify({isPinned: true,}),
    {
      headers: { "Content-Type": "application/json"},
      withCredentials: true
    })

    note.isPinned = true;

    setNotes((prevNotes: notesState) => {
      return {
        plainNotes: prevNotes.plainNotes.filter((prevNote: NoteType) => prevNote._id !== note._id),
        pinnedNotes: [...prevNotes.pinnedNotes, note],
      }
    });
    setPinned(true)
  }

  const handleRemovePin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    console.log("unpin click")

    api.patch(`./notes/${note._id}`, 
    JSON.stringify({isPinned: false,}),
    {
      headers: { "Content-Type": "application/json"},
      withCredentials: true
    })

    note.isPinned = false;

    setNotes((prevNotes: notesState) => {
      return {
        plainNotes: [...prevNotes.pinnedNotes, note],
        pinnedNotes: prevNotes.plainNotes.filter((prevNote: NoteType) => prevNote._id !== note._id),
      }
    });
    setPinned(false)

  }

  const handleArchive = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      const updateNoteStatusArgs = {
        e: e,
        shouldBeArchived: true,
        shouldBeTrashed: false,
        note: note
      }
      await UseUpdateNoteStatus(updateNoteStatusArgs);
      setNotes((prevNotes: notesState) => {
        return {
          plainNotes: prevNotes.plainNotes.filter((prevNote: NoteType) => prevNote._id !== note._id),
          pinnedNotes: prevNotes.pinnedNotes.filter((prevNote: NoteType) => prevNote._id !== note._id),
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleRestore = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  
    try {
      const updateNoteStatusArgs = {
        e: e,
        shouldBeArchived: false,
        shouldBeTrashed: false,
        note: note
      }
      await UseUpdateNoteStatus(updateNoteStatusArgs);
      setNotes((prevNotes: notesState) => {
        return {
          plainNotes: prevNotes.plainNotes.filter((prevNote: NoteType) => prevNote._id !== note._id),
          pinnedNotes: prevNotes.pinnedNotes.filter((prevNote: NoteType) => prevNote._id !== note._id),
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    try {
      await api.delete(`./notes/${note._id}`);
      setNotes((prevNotes: notesState) => {
        return {
          plainNotes: prevNotes.plainNotes.filter(prevNote => prevNote._id !== note._id),
          pinnedNotes: prevNotes.pinnedNotes.filter(prevNote => prevNote._id !== note._id),
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleMouseLeave = () => {
    if (!optionsModalState) {
      setNoteHoverState(false)
    } 
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setTimeout(()=> {
        if ((containerRef.current && !containerRef.current.contains(event.target as Node))) {
          setNoteHoverState(false)
          setOptionsModal(false);
        }
      }, 100)
    };
  
    document.addEventListener("mousedown", handleClickOutside);
   
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };  
  }, []);

  return (
    <div className={NoteStyles.container} ref={containerRef}>
      {noteState ? <NoteModal note={note} setNoteState={setNoteState} noteState={noteState} /> : null}
      <div
        className={NoteStyles.note}
        onClick={() => !noteState ? handleFocus() : null}
        onMouseEnter={() => setNoteHoverState(true)}
        onMouseLeave={() => handleMouseLeave()}
      >
         {noteHoverState || selectedNotes.includes(note) ? (
          <div className={NoteStyles.check} >
            <button className={NoteStyles.options} id={NoteStyles.check} onClick={(e)=>handleCheckClick(e)}>
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </div>
        ) : null}
        {pinned ? (
          <div className={NoteStyles.pin} >
            <button className={`${NoteStyles.options} ${NoteStyles.removePin}`} onClick={(e)=>handleRemovePin(e)}>
              <FontAwesomeIcon icon={faMapPin} />
            </button>
          </div>
        ) : noteHoverState ? (
          <div className={NoteStyles.pin}>
            <button className={NoteStyles.options} onClick={(e)=>handlePinClick(e)}>
              <FontAwesomeIcon icon={faMapPin} />
            </button>
          </div>
        ) : null}

        <input
          className={MainStyles.titleInput}

          placeholder="Title"
          type="text"
          value={note.title || ''}
          readOnly
        />
        <textarea
          placeholder="Take a note..."
          className={NoteStyles.bodyInput}
          ref={textareaRef}
          value={note.body || ''}
          readOnly
        />
        {optionsModalState ? (
          <OptionsModal notes={[note]} setOptionsModal={setOptionsModal} optionRef={optionRef} />
        ) : null}
        {noteHoverState && currentLabel.title !== "Trash" ? (
          <div className={NoteStyles.tools} ref={optionRef}>
             <button className={NoteStyles.options} onClick={(e)=>handleArchive(e)}>
              <FontAwesomeIcon icon={faArchive} />
            </button>
            <button className={NoteStyles.options} onClick={(e)=>handleOptionClick(e)}>
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </button>
          </div>
        ) : noteHoverState && currentLabel.title === "Trash" ? (
          <div className={NoteStyles.tools} ref={optionRef}>
            <button className={NoteStyles.options} onClick={(e)=>handleRestore(e)}>
              <FontAwesomeIcon icon={faTrashRestore} />
            </button>
            <button className={NoteStyles.options} onClick={(e)=>handleDelete(e)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button className={NoteStyles.options} onClick={(e)=>handleArchive(e)}>
              <FontAwesomeIcon icon={faArchive} />
            </button>
          </div>
        ) : noteHoverState && currentLabel.title === "Archive" ? (
        <div className={NoteStyles.tools} ref={optionRef}>
          <button className={NoteStyles.options} onClick={(e)=>handleRestore(e)}>
            <FontAwesomeIcon icon={faUndo} />
          </button>
          <button className={NoteStyles.options} onClick={(e)=>handleDelete(e)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
       ) : null}
      </div>
    </div>
  );
};

export default Note;