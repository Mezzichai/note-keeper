import React, { useEffect, useState, useContext } from 'react';
import headerStyles from "./headerStyles.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faBars, faUser, faMagnifyingGlass, faRotateRight, faMapPin, faEllipsisVertical, faArchive, faX, faTrash, faTrashRestore, faUndo } from '@fortawesome/free-solid-svg-icons';
import api from '../../api/axios';
import { Context } from '../../context';
import OptionsModal from '../main/Multiselect-components/OptionsModal';
import UseUpdateNoteStatus from '../../hooks/HandleTrashAndArchive';
import { NoteType, notesState } from '../../interfaces';



interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<Props> = ({ isOpen, setIsOpen, query, setQuery }) => {
  const [inputFocus, setInputFocus] = useState<boolean>(false)
  const {currentLabel, setNotes, setMultiSelectMode, multiSelectMode, selectedNotes, setSelectedNotes, notes} = useContext(Context)
  const [modalState, setModalState] = useState<boolean>(false)

  const handleQuery = async () => {
    const response = await api.get(`./notes/query/${currentLabel}}/${query}`)
    setNotes(response.data)
  }

  useEffect(() => {
    if (query) {
      handleQuery()
    }
  }, [query])

  const handleCenterFocus = () => {
    setInputFocus(true);
  };

  const handleCenterBlur = () => {
    setInputFocus(false);
  };

  const handleMultiSelectCancel = () => {
    setMultiSelectMode(false)
    setSelectedNotes([])
  }

  const handleArchive = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      selectedNotes.forEach(async (note) => {
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
      })
    } catch (error) {
      console.log(error);
    }
  }

  const handlePin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    try {
      selectedNotes.forEach(async (note) => {
        await api.patch(`./notes/${note._id}`, 
        JSON.stringify({isPinned: true}),
        {
          headers: { "Content-Type": "application/json"},
          withCredentials: true
        })
      })
      const selectedIds = selectedNotes.map(note => note._id)
      setNotes((prevNotes: notesState) => {
        return {
          plainNotes: prevNotes.plainNotes.filter((prevNote: NoteType) => selectedIds.includes(prevNote._id)),
          pinnedNotes: [...prevNotes.pinnedNotes, ...selectedNotes],
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleUnpin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
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


  useEffect(() => {
    setMultiSelectMode(false)
    setSelectedNotes([])
  }, [currentLabel, notes, setMultiSelectMode, setSelectedNotes])

  
  return (
    
    <header>
      {!multiSelectMode ? (
      <>
        <div className={headerStyles.left}>
          <button onClick={() => setIsOpen(!isOpen)}>
            <FontAwesomeIcon icon={faBars} />
          </button>

          <div className={headerStyles.title}>Keeper++</div>
        </div>

        <div 
          onFocus={handleCenterFocus}
          onBlur={handleCenterBlur}
          className={`${headerStyles.center} ${inputFocus ? headerStyles.focus : ""}`}>
          <button><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
          <input 
            placeholder='Search'
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
  
          />
          <button className={headerStyles.X}>X</button>
        </div>

        <div className={headerStyles.right}>
          <button className={headerStyles.option} id={headerStyles.arrowIcon}>
            <FontAwesomeIcon icon={faRotateRight} />
          </button>
          <button className={headerStyles.option} id={headerStyles.gearIcon}>
            <FontAwesomeIcon icon={faGear} />
          </button>
          <button className={headerStyles.option} id={headerStyles.userIcon}>
            <FontAwesomeIcon icon={faUser} />
          </button>
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
        {currentLabel.title !== "Trash" && currentLabel.title !== "Archive" ? (
          <div className={headerStyles.right}>
            {selectedNotes.every(note => note.isPinned && note.isPinned === true) ? (
            <button onClick={(e) => handleUnpin(e)} className={`${headerStyles.option} ${headerStyles.removePin} ${headerStyles.noteSelectBtn}`} >
              <FontAwesomeIcon icon={faMapPin} />
            </button>
            ) : (
            <button onClick={(e) => handlePin(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`} >
              <FontAwesomeIcon icon={faMapPin} />
            </button>
            )}
           

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
        ) : currentLabel.title === "Trash" ? (
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