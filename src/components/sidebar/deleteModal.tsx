import React from 'react'
import sidebarStyles from './sidebarStyles.module.css'
import api from '../../api/axios';


interface Props {
  title: string;
  id: string;
  getLabels: () => Promise<void>;
  setDeletionModal: React.Dispatch<React.SetStateAction<boolean>>;
}


interface LabelProps {
  id: string;
  title: string;
}

const DeleteModal: React.FC<Props> = ({title, id, getLabels, setDeletionModal}) => {
 
  const handleDeletion = async () => {
    await api.delete<LabelProps>(`./notes/label/${id}`)
    getLabels()
    setDeletionModal(false)
  }
 
  return (
    <div className={sidebarStyles.confirmModal}>

      <div className={sidebarStyles.message}>
        Are you sure you want to delete the "{title}" label and it's associated notes?
      </div>
    <div className={sidebarStyles.deleteModalBtns}> 
      <button className={sidebarStyles.confirm} onClick={() => handleDeletion()}>Yes</button>
      <button className={sidebarStyles.deny} onClick={() => setDeletionModal(false)}>No</button>
    </div>
    </div>
  )
}

export default DeleteModal