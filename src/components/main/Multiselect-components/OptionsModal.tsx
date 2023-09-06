import React, {useRef, useEffect, useState, useContext} from 'react'
import optionModalStyles from '../../header/optionModalStyles.module.css'
import LabelModal from './LabelModal';
import { Context } from '../../../context';
import UseUpdateNoteStatus from '../../../hooks/HandleTrashAndArchive';
import {  NoteType, } from '../../../interfaces';

//there are cases where passing in the handle trash function from the header would not suffice
//because the same component is being called by indivual notes

interface Props {
  notes: NoteType[];
  setOptionsModal: React.Dispatch<React.SetStateAction<boolean>>;
  optionRef?: React.RefObject<HTMLDivElement>
  isFromHeader?: boolean
}

const OptionsModal: React.FC<Props> = ({notes, setOptionsModal, isFromHeader}) => {
  
  const modalRef = useRef<HTMLDivElement>(null)
  const [labelModalState, setLabelModal] = useState<boolean>(false)
  const {setNotes} = useContext(Context)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setTimeout(()=> {
        if ((modalRef.current && !modalRef.current.contains(event.target as Node))) {
          setOptionsModal(false);
        }
      }, 100)
    };
  
    document.addEventListener("mousedown", handleClickOutside);
   
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };  
  }, []);

 
//stopPropagation is a stupid way to handle this, you should just use a ref here,then 
// and check if its being click in not compoennt
const handleTrash = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
  try {
    notes.forEach(async (note) => {
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
    })
  } catch (error) {
    console.log(error);
  }
}

  const handleChangeLabels = async (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.stopPropagation()
    if (!labelModalState) {
      setLabelModal(true)
    }
  }

  const handleCopy = async (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.stopPropagation()
    // await api.delete(`./notes/${note.label}`)
  }
  return (
    <div ref={modalRef} className={!isFromHeader ? optionModalStyles.modal : `${optionModalStyles.modal} ${optionModalStyles.headerModal}`}>

      {labelModalState ? <LabelModal setLabelModal={setLabelModal} note={notes[0]} /> : null}
      <ul>
        <li onClick={(e)=>handleTrash(e)} id={optionModalStyles.top}>Delete</li>
        {!isFromHeader ?
        <li onClick={(e) => handleChangeLabels(e)}>Change labels</li>
        : null}
        <li id={optionModalStyles.bottom} onClick={handleCopy}>Make a copy</li>
      </ul>
    </div>
  )
}

export default OptionsModal