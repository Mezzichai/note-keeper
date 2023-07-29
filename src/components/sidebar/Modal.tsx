import React, { useState } from 'react'
import sidebarStyles from './sidebarStyles.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCheck, faX} from '@fortawesome/free-solid-svg-icons'
import api from '../../api/axios';
import Label from './label';



interface Label {
  _id: string;
  title: string;
}

interface Props {
  labels: Label[];
  setLabels: React.Dispatch<React.SetStateAction<Label[]>>;
  getLabels: () => Promise<void>;
}

const Modal: React.FC<Props> = ({ labels, setLabels, getLabels}) => {

  const [newLabelState, setNewLabelState] = useState<boolean>(false)
  const [newLabel, setNewLabel] = useState<string>("")
  


  const handleNewLabel = async () => {
    try {
      const response = await api.post<Label>("./notes/label", 
        JSON.stringify({title: newLabel}),
        {
          headers: { "Content-Type": "application/json"},
          withCredentials: true
        }
      )
      console.log(response)

      setLabels([...labels, response.data]);
    } catch (error) {
      console.log(error)
    }
  }




  return (
      <div className={sidebarStyles.modal}>
        <div className={sidebarStyles.message}>Edit labels</div>

        <div className={sidebarStyles.newLabel}>
          <button className={sidebarStyles.addNewLabelBtn} onClick={() => newLabelState ? setNewLabelState(false) : setNewLabelState(true)}><FontAwesomeIcon icon={newLabelState ? faX : faPlus}/></button>
          <input 
            className={`${sidebarStyles.newLabelField} ${newLabelState ? sidebarStyles.input : null}`} 
            placeholder={"Enter a new label"}
            onChange={(e)=>setNewLabel(e.target.value)} 
            value = {newLabel}
            onFocus={()=>setNewLabelState(true)} />
          <button className={`${newLabelState ? sidebarStyles.showCheck : null} ${sidebarStyles.confirmLabelBtn}`} onClick={() => handleNewLabel()}><FontAwesomeIcon icon={faCheck}/></button>
        </div>


        {labels.map((label, index)=> {
          return <Label key={index} title={label.title} id={label._id} newLabelState = {newLabelState} setNewLabelState={setNewLabelState} getLabels={getLabels}/>
        }
        )}
        
      </div>
  )
}

export default Modal