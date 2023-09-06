import React, {useState, useRef, useEffect} from 'react'
import sidebarStyles from './sidebarStyles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faTrash, faCheck, faPencil } from '@fortawesome/free-solid-svg-icons'
import api from '../../api/axios';

interface Props {
  title: string;
  id: string;
  newLabelState: boolean;
  setNewLabelState: React.Dispatch<React.SetStateAction<boolean>>;
  getLabels: () => Promise<void>;
  handleDeletionModal: (title: string, id: string) => void;
  deletionModal: boolean
}



const Label: React.FC<Props> = ({title, id, newLabelState, setNewLabelState, getLabels, handleDeletionModal, deletionModal}) => {
  const [originalTitle, setOriginalTitle] = useState<string>(title)
  const [newTitle, setNewTitle] = useState<string>("")
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false)

  const [tagHoverState, setTagHoverState] = useState<boolean>(false)
  const [existingLabelFocusState, setExistingLabelFocusState] = useState<boolean>(false)




  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        // The click is outside the div
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
      //will the title be current?
    }
  };

  const handlePatchLabel = async () => {
    newLabelState ? setNewLabelState(false) : null
    if (!existingLabelFocusState) {
      setExistingLabelFocusState(true)
    } else if (!deletionModal) {
      await api.patch(`./notes/label/${id}`, JSON.stringify({title: newTitle}), {
        headers: { "Content-Type": "application/json"},
        withCredentials: true
        }
      )
      if (newTitle === "") {
        setNewTitle(originalTitle)
      }
      setOriginalTitle(newTitle);
      getLabels()
      setHasSubmitted(true)
    }
  }
//have the newtitle be a used if it is truthy otherwise use the originalTitle (short circuit)
  const handleBlur = () => {
    setExistingLabelFocusState(false);
    if (!hasSubmitted) {
      setNewTitle("");
    } else {
      setNewTitle("")
      setHasSubmitted(false)
    }
  }
// the only issue is the short circuiting
  
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
        value={newTitle || originalTitle} 
        className={`${sidebarStyles.label} ${existingLabelFocusState ? sidebarStyles.input : null}`} 
        onClick={() => newLabelState ? setNewLabelState(false) : null} 
        onChange={(e)=> {
          setNewTitle(e.target.value)
        }}/>
    </div>
    <button className={sidebarStyles.renameLabel} onClick={() => handlePatchLabel()}><FontAwesomeIcon icon={existingLabelFocusState ? faCheck : faPencil}/></button>
  </div>
  )
}

export default Label