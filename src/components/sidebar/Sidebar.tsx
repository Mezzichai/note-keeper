import React, {useState, useRef} from 'react'
import sidebarStyles from './sidebarStyles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faArchive, faLightbulb} from '@fortawesome/free-solid-svg-icons'
import Modal from './labelModal/Modal';
import { LabelType } from '../../interfaces';
import { useLabels } from '../../context/LabelContext';
import Label from './Label';
import { Link, useParams } from 'react-router-dom';




const Sidebar: React.FC = () => {
  const { labelId } =  useParams()
  const { labels, isOpen, setCurrentLabel } = useLabels()
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [modalState, setModalState] = useState<boolean>(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  


  
  // const handleNewLabel = async (label: LabelProp) => {
  //   try {
  //     const newLabel = await api.post<LabelProp>(
  //       "./notes/label",
  //       JSON.stringify(label),
  //       {
  //         headers: { "Content-Type": "application/json" },
  //         withCredentials: true
  //       }
  //     );
  //     setLabels((prevLabels) => [...prevLabels, newLabel.data]);
  //     console.log(newLabel);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleHover = () => {
    if (!hoverTimeoutRef.current) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovering(true);
      }, 400);
    }
  }

  const handleUnhover = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovering(false);
  }

  return (
    <div>
      {modalState ? <Modal setModalState={setModalState}/> : null}
      
      <div className={`${sidebarStyles.sidebar} ${(isOpen || isHovering) ? sidebarStyles.open : null}`} onMouseOver={()=>handleHover()} onMouseLeave={(e)=>handleUnhover(e)}>
        <button className={`${sidebarStyles.child} ${
            labelId === "" ? sidebarStyles.activeLabel : ""
          }`}>
          <Link to={`/Notes`} onClick={() => setCurrentLabel("Notes")} className={sidebarStyles.catagory}>
            <div className={sidebarStyles.icon}><FontAwesomeIcon icon={faLightbulb} /></div>
            <span>
              All Notes
            </span>
          </Link>
        </button>

        {labels.map((label: LabelType) => (
          <Label label={label} key={label._id}/>
        ))}
      
        <button className={sidebarStyles.child} onClick={() => setModalState(!modalState)}>
          <div className={sidebarStyles.icon}><FontAwesomeIcon icon={faEdit} /></div>
          <span className={sidebarStyles.catagory}>
          Edit Labels
          </span>
        </button>
        <button className={`${sidebarStyles.child} ${
            labelId === "Archive" ? sidebarStyles.activeLabel : ""
          }`}>
          <Link to={`/Archive`} onClick={() => setCurrentLabel("Archive")} className={sidebarStyles.catagory}>
            <div className={sidebarStyles.icon}><FontAwesomeIcon icon={faArchive} /></div>
            <span>
              Archive
            </span>
          </Link>
        </button>
        <button className={`${sidebarStyles.child} ${
            labelId === "Trash" ? sidebarStyles.activeLabel : ""
          }`}>
          <Link to={`/Trash`} onClick={() => setCurrentLabel("Trash")} className={sidebarStyles.catagory}>
            <div className={sidebarStyles.icon}><FontAwesomeIcon icon={faTrash} /></div>
            <span>
              Trash
            </span>
          </Link>
        </button>
      </div>
    </div>
  )
}

export default Sidebar