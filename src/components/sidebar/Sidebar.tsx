import React, {useState, useEffect, useContext, useRef} from 'react'
import sidebarStyles from './sidebarStyles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faTrash, faEdit, faArchive, faLightbulb} from '@fortawesome/free-solid-svg-icons'
import Modal from './Modal';
import api from '../../api/axios';
import { Context } from '../../context/context';
import { LabelType } from '../../interfaces';


interface Props {
  isOpen: boolean;
  setCurrentLabel: React.Dispatch<React.SetStateAction<LabelType>>;
}


const Sidebar: React.FC<Props> = ({ isOpen, setCurrentLabel }) => {

  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [modalState, setModalState] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const {currentLabel, setLabels, labels} = useContext(Context)
  const hoverTimeoutRef = useRef<number | null>(null);


  
  const getLabels = async () => {
    try {
      const response = await api.get("./notes/label");
      setLabels(response.data);
      console.log(response.data)
      setLoading(false)
    } catch (error) {
      console.log("Error fetching labels:", error);
    }
  };


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

  useEffect(() => {
    getLabels();
  }, []);


  const handleLabelSwitch = (label: LabelType) => {
    if (currentLabel._id && label._id && currentLabel._id !== label._id) {
      setCurrentLabel(label)
    } else if (currentLabel.title !== label.title) {
      setCurrentLabel(label)
    } 
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {modalState ? <Modal labels={labels} getLabels={getLabels} setModalState={setModalState}/> : null}
      
      <div className={`${sidebarStyles.sidebar} ${(isOpen || isHovering) ? sidebarStyles.open : null}`} onMouseOver={()=>handleHover()} onMouseLeave={(e)=>handleUnhover(e)}>
        <button className={`${sidebarStyles.child} ${
            currentLabel.title === "Notes" ? sidebarStyles.activeLabel : ""
          }`} onClick={() => {handleLabelSwitch({title: "Notes", _id: "default"})}}>
          <div className={sidebarStyles.icon}><FontAwesomeIcon icon={faLightbulb} /></div>
          <span className={sidebarStyles.catagory}>
          All notes
          </span>
        </button>

        {labels.map((label, index) => (
        <button
          key={index} 
          onClick={() => handleLabelSwitch(label)}
          className={`${sidebarStyles.child} ${
            currentLabel.title === label.title ? sidebarStyles.activeLabel : ""
          }`}>
          <div className={sidebarStyles.icon}><FontAwesomeIcon icon={faTag} /></div>
          <span className={sidebarStyles.catagory}>
          {label.title}
          </span>
        </button>
        ))}
        


        <button className={`${sidebarStyles.child} ${
            currentLabel.title === "Edit" ? sidebarStyles.activeLabel : ""
          }`} onClick={() => setModalState(!modalState)}>
          <div className={sidebarStyles.icon}><FontAwesomeIcon icon={faEdit} /></div>
          <span className={sidebarStyles.catagory}>
          Edit Labels
          </span>
        </button>
        <button className={`${sidebarStyles.child} ${
            currentLabel.title === "Archive" ? sidebarStyles.activeLabel : ""
          }`} onClick={() => handleLabelSwitch({title: "Archive", _id: "default"})}>
          <div className={sidebarStyles.icon}><FontAwesomeIcon icon={faArchive} /></div>
          <span className={sidebarStyles.catagory}>
          Archive
          </span>
        </button>
        <button className={`${sidebarStyles.child} ${
            currentLabel.title === "Trash" ? sidebarStyles.activeLabel : ""
          }`} onClick={() => handleLabelSwitch({title: "Trash", _id: "default"})}>
          <div className={sidebarStyles.icon}><FontAwesomeIcon icon={faTrash} /></div>
          <span className={sidebarStyles.catagory}>
          Trash
          </span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar