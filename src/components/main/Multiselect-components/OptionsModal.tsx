import React, {useRef, useEffect, useState} from 'react'
import optionModalStyles from '../../header/optionModalStyles.module.css'
import LabelModal from './LabelModal';
import { useNotes } from '../../../context/NoteContext';
import { useLabels } from '../../../context/LabelContext';

//there are cases where passing in the handle trash function from the header would not suffice
//because the same component is being called by indivual notes

interface Props {
  notes: NoteType[];
  setOptionsModal: React.Dispatch<React.SetStateAction<boolean>>;
  optionRef?: React.RefObject<HTMLDivElement>
  isFromHeader?: boolean
  handleTrash: (e: React.MouseEvent) => Promise<void>
}

const OptionsModal: React.FC<Props> = ({handleTrash, notes, setOptionsModal, isFromHeader}) => {
  
  const modalRef = useRef<HTMLDivElement>(null)
  const [labelModalState, setLabelModal] = useState<boolean>(false)
  const {setNotes} = useNotes()
  const {labels} = useLabels()


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



  const handleChangeLabels = async (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.stopPropagation()
    if (!labelModalState) {
      setLabelModal(true)
    }
  }

  const handleCopy = async (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.stopPropagation()
    try {
      // const copiedNotes = await Promise.all(
      //   notes.map(async (note) => {
      //     const copiedNote = await api.post(`./notes/newnote`, 
      //       JSON.stringify({
      //         title: note.title,
      //         body: note.body,
      //         isTrashed: false,
      //         isArchived: false,
      //         isPinned: false,
      //         labels: note.labels
      //       })
      //   })
      // )

      // setNotes((prevNotes) => ({
      //   ...prevNotes,
      //   plainNotes: [...prevNotes.plainNotes, ...copiedNotes],
      // }));    
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div ref={modalRef} className={!isFromHeader ? optionModalStyles.modal : `${optionModalStyles.modal} ${optionModalStyles.headerModal}`}>

      {labelModalState ? <LabelModal setLabelModal={setLabelModal} note={notes[0]} /> : null}
      <ul>
        <li onClick={(e)=>handleTrash(e)} id={optionModalStyles.top}>Delete</li>
        {!isFromHeader && labels.length > 0 ?
        <li onClick={(e) => handleChangeLabels(e)}>Change labels</li>
        : null}
        <li id={optionModalStyles.bottom} onClick={(e) => handleCopy(e)}>Make a copy</li>
      </ul>
    </div>
  )
}

export default OptionsModal