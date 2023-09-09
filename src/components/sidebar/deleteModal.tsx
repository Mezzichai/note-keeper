import React, {useContext} from 'react'
import { Context } from '../../context';
import sidebarStyles from './sidebarStyles.module.css'
import api from '../../api/axios';
import { LabelType } from '../../interfaces';

interface Props {
  title: string;
  id: string;
  getLabels: () => Promise<void>;
  setDeletionModal: React.Dispatch<React.SetStateAction<boolean>>;
}




const DeleteModal: React.FC<Props> = ({title, id, getLabels, setDeletionModal}) => {
  const {notes, setCurrentLabel, labels} = useContext(Context)

  const handleDeletion = async () => {
    await api.delete<LabelType>(`./notes/label/${id}`)
    getLabels()
    //this ensures that no note that exist within other existing labels gets deleted
    const labelIds = labels.map(label => label._id)
    notes.plainNotes.forEach(async (note) => {
      if (note.labels.filter(label => labelIds.includes(label._id)).length === 1) {
        await api.delete<LabelType>(`./notes/${note._id}`)
      }
    })

    notes.pinnedNotes.forEach(async (note) => {
      if (note.labels.filter(label => labelIds.includes(label._id)).length === 1) {
          await api.delete<LabelType>(`./notes/${note._id}`)
      }
    })
    setCurrentLabel({title: "Notes", _id: "default"})
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