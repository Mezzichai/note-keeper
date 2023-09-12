import React, { useState, useRef, useLayoutEffect, useContext, useEffect } from 'react';
import NoteStyles from './NoteStyles.module.css';
import MainStyles from './MainStyles.module.css'
import NoteModal from './NoteModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faCheck, faEllipsisVertical, faMapPin, faTrash, faTrashRestore, faUndo, faX } from '@fortawesome/free-solid-svg-icons';
import { Context } from '../../context/context';
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
    e.stopPropagation();
    try {
      const updatedNote = await api.patch(
        `./notes/${note._id}`,
        JSON.stringify({ isPinned: true }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      setNotes((prevNotes: notesState) => {
        console.log(prevNotes, updatedNote.data)

        return {
          plainNotes: prevNotes.plainNotes.filter(
            (prevNote: NoteType) => prevNote._id !== note._id
          ),
          pinnedNotes: [...prevNotes.pinnedNotes, updatedNote.data],
        };
      });
    
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemovePin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    try {
      const updatedNote = await api.patch(
        `./notes/${note._id}`,
        JSON.stringify({ isPinned: false }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
    // Ensure the note's isPinned property is correctly updated
      setNotes((prevNotes: notesState) => {
        return {
          plainNotes: [...prevNotes.plainNotes, updatedNote.data],
          pinnedNotes: prevNotes.pinnedNotes.filter(
            (prevNote: NoteType) => prevNote._id !== note._id
          ),
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

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
      await api.patch(
        `./notes/${note._id}`,
        JSON.stringify({ isPinned: false }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
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

  const handleDelete = async () => {
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

  const handleTrash = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
        const updateNoteStatusArgs = {
          e: e,
          shouldBeArchived: false,
          shouldBeTrashed: true,
          note: note
        }
        await UseUpdateNoteStatus(updateNoteStatusArgs);
        setNotes(prevNotes => {
          return {
            plainNotes: prevNotes.plainNotes.filter(prevNote => note._id !== prevNote._id),
            pinnedNotes: prevNotes.pinnedNotes.filter(prevNote => note._id !== prevNote._id),
          }
        });
        await api.patch(
          `./notes/${note._id}`,
          JSON.stringify({ isPinned: false }),
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );
    } catch (error) {
      console.log(error);
    }
  }

  const handleNoteUpdate = (note: NoteType) => {
    console.log(note)
    setNotes((prevNotes) => {
      return {
        plainNotes: prevNotes.plainNotes.map(prevNote => prevNote._id === note._id ? note : prevNote),
        pinnedNotes: prevNotes.pinnedNotes.map(prevNote => prevNote._id === note._id ? note : prevNote),
      }
    })
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
      {noteState ? <NoteModal handleDelete={handleDelete} note={note} handleNoteUpdate={handleNoteUpdate} setNoteState={setNoteState} noteState={noteState} /> : null}
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


        {note.isPinned && !["Trash", "Archive", "Query"].includes(currentLabel.title) ? (
          <div className={NoteStyles.pin}>
            <button className={NoteStyles.options} id={NoteStyles.removePin} onClick={(e)=>handleRemovePin(e)}>
              <FontAwesomeIcon icon={faMapPin} />
            </button>
          </div>
        ) : noteHoverState && !["Trash", "Archive", "Query"].includes(currentLabel.title) ? (
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
        {noteHoverState && !["Trash", "Archive"].includes(currentLabel.title) ? (
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
            <button className={NoteStyles.options} onClick={()=>handleDelete()}>
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