import React, {useState, useRef, useEffect, useContext} from 'react'
import sidebarStyles from './sidebarStyles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faTrash, faCheck, faPencil } from '@fortawesome/free-solid-svg-icons'
import api from '../../api/axios';
import { Context } from '../../context/context';

interface Props {
  labelTitle: string;
  id: string;
  newLabelState: boolean;
  setNewLabelState: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeletionModal: (title: string, id: string) => void;
  deletionModal: boolean
}



const Label: React.FC<Props> = ({labelTitle, id, newLabelState, setNewLabelState, handleDeletionModal, deletionModal}) => {
  const {setLabels, labels} = useContext(Context)
  const [title, setTitle] = useState<string>(labelTitle)

  const [tagHoverState, setTagHoverState] = useState<boolean>(false)
  const [existingLabelFocusState, setExistingLabelFocusState] = useState<boolean>(false)




  const divRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        handleBlur()
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
    

  const handleFocusAndHover = (setter: React.Dispatch<React.SetStateAction<boolean>>, desiredState: boolean) => {
    setter(desiredState)
  }
  
  const handleTrashClick = () => {
    newLabelState ? setNewLabelState(false) : null;
    if (existingLabelFocusState) {
      handleBlur()
    } else if (!deletionModal) {
      handleDeletionModal(title, id)
    }
  };

  const handlePatchLabel = async () => {
    newLabelState ? setNewLabelState(false) : null
    if (!existingLabelFocusState) {
      setExistingLabelFocusState(true)
    } else if (!deletionModal) {
      const response = await api.patch(`./notes/label/${id}`, JSON.stringify({title: title}), {
        headers: { "Content-Type": "application/json"},
        withCredentials: true
        }
      )
      
      const allLabelsExceptNew = labels.filter(label => label._id !== response.data._id)
      setLabels(() => ([...allLabelsExceptNew, response.data]))
      handleBlur()
    }
  }

  const handleBlur = () => {
    setExistingLabelFocusState(false);
  }

  
  return (
  
  <div className={sidebarStyles.field} ref={divRef}>
    <button className={sidebarStyles.deleteLabel} onClick={()=> handleTrashClick()} onMouseOver={()=>(handleFocusAndHover(setTagHoverState, true))} onMouseLeave={()=>(handleFocusAndHover(setTagHoverState, false))}>
      <FontAwesomeIcon icon={tagHoverState || existingLabelFocusState ? faTrash : faTag} />
    </button>
    <div className={sidebarStyles.edit} 
    onMouseOver={()=>handleFocusAndHover(setTagHoverState, true)} 
    onMouseLeave={()=>handleFocusAndHover(setTagHoverState, false)} 
    onFocus={()=>handleFocusAndHover(setExistingLabelFocusState, true)}>
      <input 
        value={title} 
        className={`${sidebarStyles.label} ${existingLabelFocusState ? sidebarStyles.input : null}`} 
        onClick={() => newLabelState ? setNewLabelState(false) : null} 
        onChange={(e)=> {
          setTitle(e.target.value)
        }}/>
    </div>
    <button className={sidebarStyles.renameLabel} onClick={() => handlePatchLabel()}><FontAwesomeIcon icon={existingLabelFocusState ? faCheck : faPencil}/></button>
  </div>
  )
}

export default Label