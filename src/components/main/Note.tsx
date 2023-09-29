import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import NoteStyles from './NoteStyles.module.css';
import MainStyles from './MainStyles.module.css'
import NoteModal from './NoteModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faCheck, faEllipsisVertical, faMapPin, faTrash, faTrashRestore, faUndo, faX } from '@fortawesome/free-solid-svg-icons';
import { useNotes } from '../../context/NoteContext';
import OptionsModal from './Multiselect-components/OptionsModal';
import { NoteType } from '../../interfaces';
import { deleteNote, updateNote } from '../../utils/notes';
import { useAsyncFn } from '../../hooks/useAsync';
import { useLabels } from '../../context/LabelContext';
interface Props {
  note: NoteType;
}

const Note: React.FC<Props> = ({ note }) => {
  const [noteState, setNoteState] = useState<boolean>(false);
  const [noteHoverState, setNoteHoverState] = useState<boolean>(false);
  const [optionsModalState, setOptionsModal] = useState<boolean>(false);
  const {updateLocalNote, deleteLocalNote, setSelectedNotes, selectedNotes, setMultiSelectMode, multiSelectMode, setNotes} = useNotes()
  const {currentLabel} = useLabels()

  const updateNoteState = useAsyncFn(updateNote)
  const deleteNoteState = useAsyncFn(deleteNote)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const optionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null)
  
 
  useLayoutEffect(() => {
    if (textareaRef.current) {
      // Calculate the scroll height of the textarea content
      const scrollHeight = textareaRef.current.scrollHeight;
      // Set the textarea height to the scroll height
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [note.body]); // Recalculate height whenever the note body changes


  const handleFocus = () => {
    setNoteState(true);
  };


  const handleCheckClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    e.stopPropagation();
    if (!multiSelectMode) {
      setMultiSelectMode(true)
      console.log(multiSelectMode)
    }
    if (selectedNotes.every(selectedNote => selectedNote._id !== note._id)) {
      setSelectedNotes([...selectedNotes, note])
    }
  }

  const handleXClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    const filteredNotes = selectedNotes.filter(prevNote => prevNote._id !== note._id)
    setSelectedNotes([...filteredNotes])
  }


  const handleOptionClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (!optionsModalState) {
      setOptionsModal(true)
    } 
  }

  const handlePinClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    return updateNoteState.execute({title: note.title, body: note.body, id: note._id, options: {isPinned: true}})
    .then(note => {
      updateLocalNote(note);
    })
  };

  const handleRemovePin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    return updateNoteState.execute({title: note.title, body: note.body, id: note._id, options: {isPinned: false}})
    .then(note => {
      updateLocalNote(note);
    })
  };

  const handleArchive = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    return updateNoteState.execute({title: note.title, body: note.body, id: note._id, 
      options: {isArchived: true,
      isTrashed: false,}
    }).then(note => {
      deleteLocalNote(note)
    })
  }

  const handleRestore = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    return updateNoteState.execute({title: note.title, body: note.body, id: note._id,
      options: {isArchived: false,
      isTrashed: false}
    }).then(note => {
      deleteLocalNote(note)
    })
  }

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined) => {
    e?.stopPropagation()

    return deleteNoteState.execute(note._id)
    .then(note => {
      deleteLocalNote(note)
    })
  }

  const handleTrash = async (e: React.MouseEvent) => {
    e.stopPropagation()
    return updateNoteState.execute({title: note.title, body: note.body, id: note._id,
      options: {isArchived: false,
        isTrashed: true}
    }).then(note => {
      console.log(note)
      deleteLocalNote(note)
    })
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
      {noteState ? <NoteModal handleDelete={handleDelete} note={note} setNoteState={setNoteState} noteState={noteState} /> : null}
      <div
        className={NoteStyles.note}
        onClick={() => !noteState ? handleFocus() : null}
        onMouseEnter={() => setNoteHoverState(true)}
        onMouseLeave={() => handleMouseLeave()}
      >
        {noteHoverState && selectedNotes.includes(note) ? (
          <div className={NoteStyles.check} >
            <button className={NoteStyles.options} id={NoteStyles.check} onClick={(e)=>handleXClick(e)}>
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
          ) : selectedNotes.includes(note) || noteHoverState ? (
          <div className={NoteStyles.check} >
            <button className={NoteStyles.options} id={NoteStyles.check} onClick={(e)=>handleCheckClick(e)}>
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </div>
          ) : (
            null
          )
        }


        {note.isPinned && !["Trash", "Archive", "Query"].includes(currentLabel) ? (
          <div className={NoteStyles.pin}>
            <button className={NoteStyles.options} id={NoteStyles.removePin} onClick={(e)=>handleRemovePin(e)}>
              <FontAwesomeIcon icon={faMapPin} />
            </button>
          </div>
        ) : noteHoverState && !["Trash", "Archive", "Query"].includes(currentLabel) ? (
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
          <OptionsModal handleTrash={handleTrash} notes={[note]} setOptionsModal={setOptionsModal} optionRef={optionRef} />
        ) : null}
        {noteHoverState && !["Trash", "Archive"].includes(currentLabel) ? (
          <div className={NoteStyles.tools} ref={optionRef}>
             <button className={NoteStyles.options} onClick={(e)=>handleArchive(e)}>
              <FontAwesomeIcon icon={faArchive} />
            </button>
            <button className={NoteStyles.options} onClick={(e)=>handleOptionClick(e)}>
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </button>
          </div>
        ) : noteHoverState && currentLabel === "Trash" ? (
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
        ) : noteHoverState && currentLabel === "Archive" ? (
        <div className={NoteStyles.tools} ref={optionRef}>
          <button className={NoteStyles.options} onClick={(e)=>handleRestore(e)}>
            <FontAwesomeIcon icon={faUndo} />
          </button>
          <button className={NoteStyles.options} onClick={(e)=>handleTrash(e)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
       ) : null}
      </div>
    </div>
  );
};

export default Note;