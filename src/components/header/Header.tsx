import React, { useEffect, useState,  } from 'react';
import headerStyles from "./headerStyles.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars,faMapPin, faEllipsisVertical, faArchive, faX, faTrash, faTrashRestore, faUndo } from '@fortawesome/free-solid-svg-icons';
import OptionsModal from '../main/Multiselect-components/OptionsModal';
import { NoteType, notesState } from '../../interfaces';
import { useLabels } from '../../context/LabelContext';
import { useNotes } from '../../context/NoteContext';
import SearchBar from './SearchBar';


const Header: React.FC = () => {
  const {setNotes, notes, setMultiSelectMode, multiSelectMode, selectedNotes, setSelectedNotes} = useNotes()
  const {setIsOpen, isOpen, currentLabel} = useLabels()
  const [modalState, setModalState] = useState<boolean>(false)
  const [query, setQuery] = useState<string>("")

  useEffect(() => {
    if (query) {
    setNotes((prevNotes)=> {
      const plainNotes = prevNotes.plainNotes.filter(note => {
        return (note.body && note.body.includes(query)) ||
        (note.title && note.title.includes(query))
      })
    
      const pinnedNotes = prevNotes.pinnedNotes.filter(note => {
        return (note.body && note.body.includes(query)) ||
        (note.title && note.title.includes(query))
      })
      
      return {
        plainNotes: [...plainNotes],
        pinnedNotes: [...pinnedNotes],
      }
    })
    }
  }, [query])

  useEffect(() => {
    if (multiSelectMode) {
      if (selectedNotes.length <= 0) {
        setMultiSelectMode(false)
      }
    }
  }, [selectedNotes])

  useEffect(() => {
    if (multiSelectMode) {
      setMultiSelectMode(false)
      setSelectedNotes([])
    }
    if (query) {
      setQuery("")
    }
  }, [currentLabel, notes, setMultiSelectMode, setSelectedNotes])

  
  const handleMultiSelectCancel = () => {
    setMultiSelectMode(false)
    setSelectedNotes([])
  }


  
  // useEffect(() => {
  //   const updateQueryParam = () => {
  //     const newUrl = `/search/query${query ? `?query=${encodeURIComponent(query)}` : ''}`;
  //     navigate(newUrl, { replace: true });
  //   };

  //   // Use a timeout to avoid updating the URL too frequently as the user types
  //   const timeoutId = setTimeout(updateQueryParam, 500);

  //   return () => clearTimeout(timeoutId);
  // }, [query, navigate]);


  const handleArchive = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      selectedNotes.forEach(async (note) => {
        const updateNoteStatusArgs = {
          e: e,
          shouldBeArchived: true,
          shouldBeTrashed: false,
          note: note
        }
        setNotes((prevNotes: notesState) => {
          return {
            plainNotes: prevNotes.plainNotes.filter((prevNote: NoteType) => prevNote._id !== note._id),
            pinnedNotes: prevNotes.pinnedNotes.filter((prevNote: NoteType) => prevNote._id !== note._id),
          }
        });
      })
    } catch (error) {
      console.log(error);
    }
  }

  const handlePin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    try {
      const updatedNotes = await Promise.all(
        selectedNotes.map(async (note) => {
          let updatedNote;
          if (!note.isPinned) {
             updatedNote = {
              data: "da"
             }
          }
          return updatedNote ? updatedNote.data : note;
        })
      );
      //you MUST use the most current notes because you are SETTING the notes to these notes,
      //and the property `ispinned` must be current because it is used
      //in the note conponent
      const selectedIds = updatedNotes.map(note => note._id);
      const pinnedIds = notes.pinnedNotes.map(note => note._id);
      const newlyPinned = updatedNotes.filter(note => !pinnedIds.includes(note._id))
      setNotes((prevNotes: notesState) => {
        return {
          plainNotes: prevNotes.plainNotes.filter((prevNote: NoteType) => !selectedIds.includes(prevNote._id)),
          pinnedNotes: [...prevNotes.pinnedNotes, ...newlyPinned],
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleUnpin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    try {
      const updatedNotes = await Promise.all(
        selectedNotes.map(async (note) => {
          const updatedNote = await api.patch(
              `./notes/${note._id}`,
              JSON.stringify({ isPinned: false }),
              {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
              }
            );
            return updatedNote ? updatedNote.data : note;
        })
      );
      //you MUST use the most current notes because you are SETTING the notes to these notes,
      //and the property `ispinned` must be current because it is used
      //in the note conponent
      const selectedIds = updatedNotes.map(note => note._id);
      setNotes((prevNotes: notesState) => {
        return {
          plainNotes: [...prevNotes.plainNotes, ...updatedNotes],
          pinnedNotes: prevNotes.pinnedNotes.filter((prevNote: NoteType) => !selectedIds.includes(prevNote._id)),
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleTrash = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      selectedNotes.forEach(async (note) => {
        const updateNoteStatusArgs = {
          e: e,
          shouldBeArchived: false,
          shouldBeTrashed: true,
          note: note
        }
        await UseUpdateNoteStatus(updateNoteStatusArgs);
        
        setNotes((prevNotes: notesState) => {
          return {
            plainNotes: prevNotes.plainNotes.filter((prevNote: NoteType) => prevNote._id !== note._id),
            pinnedNotes: prevNotes.pinnedNotes.filter((prevNote: NoteType) => prevNote._id !== note._id),
          }
        });
      })
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    selectedNotes.forEach(async (note) => {
      try {
        await api.delete(`./notes/${note._id}`)
        setNotes((prevNotes: notesState) => {
          return {
            plainNotes: prevNotes.plainNotes.filter((prevNote: NoteType) => prevNote._id !== note._id),
            pinnedNotes: prevNotes.pinnedNotes.filter((prevNote: NoteType) => prevNote._id !== note._id),
          }
        });
      } catch (error) {
        console.error(error)
      }
    })
  }

  
  const handleRestore = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      selectedNotes.forEach(async (note) => {
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
      })
    } catch (error) {
      console.log(error);
    }
  }





  return (
    <header>
      {!multiSelectMode ? (
      <>
        <div className={headerStyles.left}>
          <button onClick={() => setIsOpen(!isOpen)} className={headerStyles.icon}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className={headerStyles.title}>Keeper++</div>
        </div>

        <div className={headerStyles.center}>
          <SearchBar currentLabel={currentLabel} setQuery={setQuery} query={query} />
        </div>

        <div className={headerStyles.right}>
      
        </div>
      </>
      ) : (
      <>
        <div className={headerStyles.left}>
          <button onClick={() => handleMultiSelectCancel()} className={headerStyles.noteSelectBtn}>
            <FontAwesomeIcon icon={faX} /> 
          </button>

          <div className={headerStyles.title}>{selectedNotes.length} selected</div>
        </div>
        {!["Trash", "Archive"].includes(currentLabel || "") ? (
          <div className={headerStyles.right}>
            {location.pathname !== '/search/query' ? 
              selectedNotes.every(note => note.isPinned === true) ? (
              <button onClick={(e) => handleUnpin(e)} className={`${headerStyles.option} ${headerStyles.removePin} ${headerStyles.noteSelectBtn}`} >
                <FontAwesomeIcon icon={faMapPin} />
              </button>
              ) : (
              <button onClick={(e) => handlePin(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`} >
                <FontAwesomeIcon icon={faMapPin} />
              </button>
              )
            : null}

            <button onClick={(e) => handleArchive(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faArchive} />
            </button>
            <button onClick={() => setModalState(!modalState)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </button>
            {modalState ? (
              <OptionsModal notes={selectedNotes} setOptionsModal={setModalState} isFromHeader={true}/>
            ) : null}
          </div>
        ) : currentLabel === "Trash" ? (
          <div className={headerStyles.right}>
            <button onClick={(e) => handleArchive(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faArchive} />
            </button>
            <button onClick={(e) => handleDelete(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button onClick={(e) => handleRestore(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faTrashRestore} />
            </button>
          </div>
        ) : (
          <div className={headerStyles.right}>
            <button onClick={(e) => handleTrash(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button onClick={(e) => handleRestore(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faUndo} />
            </button>
          </div>
        )}
        
      </>
      )}
    </header>
  
  )
}

export default Header;