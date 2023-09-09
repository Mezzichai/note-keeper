import React, { useState, useRef, useEffect } from 'react'
import sidebarStyles from './sidebarStyles.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCheck, faX} from '@fortawesome/free-solid-svg-icons'
import api from '../../api/axios';
import Label from './label';
import DeleteModal from './deleteModal';

import { LabelType } from '../../interfaces';

interface Props {
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  labels: LabelType[];
  // setLabels: React.Dispatch<React.SetStateAction<Label[]>>;
  getLabels: () => Promise<void>;
}

const Modal: React.FC<Props> = ({ labels, getLabels, setModalState}) => {

  const [newLabelState, setNewLabelState] = useState<boolean>(false)
  const [newLabel, setNewLabel] = useState<string>("")
  
  const [deletionModalInfo, setDeletionModalInfo] = useState({
    title: "",
    id: ""
  })

  const [deletionModal, setDeletionModal] = useState<boolean>(false)


  const handleDeletionModal = (title: string, id: string) => {
    setDeletionModalInfo({title: title, id: id})
    setDeletionModal(true)
  }


  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setTimeout(()=> {
        if (divRef.current && !divRef.current.contains(event.target as Node)) {
          setModalState(false)
        }
      }, 100)
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setModalState]);



  const handleNewLabel = async () => {
    try {
       await api.post("./notes/label", 
        JSON.stringify({title: newLabel}),
        {
          headers: { "Content-Type": "application/json"},
          withCredentials: true
        }
      )
      getLabels()
    } catch (error) {
      console.log(error)
    }
  }

  return (
      <div className={sidebarStyles.modal} ref={divRef}>
        {deletionModal ? (
          <DeleteModal getLabels={getLabels} title={deletionModalInfo.title} id={deletionModalInfo.id} setDeletionModal={setDeletionModal}/>
          ) : null
        }
        <div className={sidebarStyles.message}>Edit labels</div>

        <div className={sidebarStyles.newLabel}>
          <button className={sidebarStyles.addNewLabelBtn} onClick={() => newLabelState ? setNewLabelState(false) : setNewLabelState(true)}><FontAwesomeIcon icon={newLabelState ? faX : faPlus}/></button>
          <input 
            className={`${sidebarStyles.newLabelField} ${newLabelState ? sidebarStyles.input : null}`} 
            placeholder={"Enter a new label"}
            onChange={(e)=>setNewLabel(e.target.value)} 
            value = {newLabel}
            onFocus={()=>setNewLabelState(true)} 
            onBlur={()=>setTimeout(() => {
              setNewLabel("") 
            }, 100)}
            />
          <button className={`${newLabelState ? sidebarStyles.showCheck : null} ${sidebarStyles.confirmLabelBtn}`} onClick={() => handleNewLabel()}><FontAwesomeIcon icon={faCheck}/></button>
        </div>


        {labels.map((label, index)=> {
          return <Label key={index} title={label.title} id={label._id} newLabelState = {newLabelState} setNewLabelState={setNewLabelState} getLabels={getLabels} handleDeletionModal={handleDeletionModal} deletionModal={deletionModal}/>
        }
        )}
        
      </div>
  )
}

export default Modal