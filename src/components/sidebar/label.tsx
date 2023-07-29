import React, {useState, useRef} from 'react'
import sidebarStyles from './sidebarStyles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faTrash, faCheck, faPencil } from '@fortawesome/free-solid-svg-icons'
import api from '../../api/axios';

interface Props {
  title: string;
  id: string;
  newLabelState: boolean;
  setNewLabelState: React.Dispatch<React.SetStateAction<boolean>>;
  getLabels: () => Promise<void>
}

interface LabelProps {
  id: string;
  title: string;
}

const Label: React.FC<Props> = ({title, id, newLabelState, setNewLabelState, getLabels}) => {
  const [newTitle, setNewTitle] = useState<string>(title)
  const [tagHoverState, setTagHoverState] = useState<boolean>(false)
  const [existingLabelFocusState, setExistingLabelFocusState] = useState<boolean>(false)
  const isChangingLabel = useRef(false)
  const handleFocusAndHover = (setter: React.Dispatch<React.SetStateAction<boolean>>, desiredState: boolean) => {
    setter(desiredState)
  }

  const handleTrashClick = () => {
    newLabelState ? setNewLabelState(false) : null;
    if (existingLabelFocusState) {
      setExistingLabelFocusState(false);
    } else {
      // a simple modal that asks whether you want to del the label and the associated notes
    }
  };

  const handlePatchLabel = async () => {
    isChangingLabel.current = true 
    //find out if there is a way to rerender only one title

    //handle change for individual then, call a get for this single label and call a drilled handler to do the same for the sidebar, 
    // use the || short circuiting to check if the individual, more current, title is present
    newLabelState ? setNewLabelState(false) : null
    if (!existingLabelFocusState) {
      setExistingLabelFocusState(true)
    } else {
      const response = await api.patch<LabelProps>(`./notes/label/${id}`, JSON.stringify({title: newTitle}), {
        headers: { "Content-Type": "application/json"},
        withCredentials: true
        }
      )
        console.log(response)
        getLabels()
    }
    isChangingLabel.current = false
  }

//must be timed out so handletrashclick has a chance to clear titles 
  const handleBlur = () => {
    setTimeout(() => {
      if (!isChangingLabel.current) {
        setExistingLabelFocusState(false);
        setNewTitle(title);
      }
  }, 100);
  }




  return (
  <div className={sidebarStyles.field} onBlur={()=>{handleBlur()}}>
    <button className={sidebarStyles.deleteLabel} onClick={()=> handleTrashClick()} onMouseOver={()=>(handleFocusAndHover(setTagHoverState, true))} onMouseLeave={()=>(handleFocusAndHover(setTagHoverState, false))}>
      <FontAwesomeIcon icon={tagHoverState || existingLabelFocusState ? faTrash : faTag} />
    </button>
    <div className={sidebarStyles.edit} 
    onMouseOver={()=>handleFocusAndHover(setTagHoverState, true)} 
    onMouseLeave={()=>handleFocusAndHover(setTagHoverState, false)} 
    onFocus={()=>handleFocusAndHover(setExistingLabelFocusState, true)}>
      <input 
        value={newTitle} 
        className={`${sidebarStyles.label} ${existingLabelFocusState ? sidebarStyles.input : null}`} 
        onClick={() => newLabelState ? setNewLabelState(false) : null} 
        onChange={(e)=> setNewTitle(e.target.value)}/>
    </div>
    <button className={sidebarStyles.renameLabel} onClick={() => handlePatchLabel()}  onMouseDown={(e) => e.preventDefault()}><FontAwesomeIcon icon={existingLabelFocusState ? faCheck : faPencil}/></button>
  </div>
  )
}

export default Label