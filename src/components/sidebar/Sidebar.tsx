import React, {useState, useEffect} from 'react'
import sidebarStyles from './sidebarStyles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faTrash, faEdit, faArchive} from '@fortawesome/free-solid-svg-icons'
import Modal from './Modal';
import api from '../../api/axios';
interface Props {
  isOpen: boolean;
}

const Sidebar: React.FC<Props> = ({ isOpen }) => {

  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [modalState, setModalState] = useState<boolean>(false)


  interface Label {
    _id: string;
    title: string;
  }
  const [labels, setLabels] = useState<Label[]>([])


  const getLabels = async () => {
    try {
      const response = await api.get("./notes/label");
      setLabels(response.data);
      console.log(response.data)

    } catch (error) {
      console.log("Error fetching labels:", error);
    }
  };
  
  useEffect(() => {
    getLabels();
  }, []);


  return (
    <div>
      {modalState ? <Modal labels={labels} setLabels={setLabels} getLabels={getLabels}/> : null}
      
      <div className={`${sidebarStyles.sidebar} ${(isOpen || isHovering) ? sidebarStyles.open : null}`} onMouseOver={()=>setIsHovering(true)} onMouseLeave={()=>setIsHovering(false)}>
        <button className={sidebarStyles.child}>
          <div className={sidebarStyles.icon}><FontAwesomeIcon icon={faTag} /></div>
          <span className={sidebarStyles.catagory}>
          All notes
          </span>
        </button>

        {labels.map((label, index) => (
        <button className={sidebarStyles.child} key={index}>
          <div className={sidebarStyles.icon}><FontAwesomeIcon icon={faTag} /></div>
          <span className={sidebarStyles.catagory}>
          {label.title}
          </span>
        </button>
        ))}
        


        <button className={sidebarStyles.child} onClick={() => setModalState(!modalState)}>
          <div className={sidebarStyles.icon}><FontAwesomeIcon icon={faEdit} /></div>
          <span className={sidebarStyles.catagory}>
          Edit Labels
          </span>
        </button>
        <button className={sidebarStyles.child}>
          <div className={sidebarStyles.icon}><FontAwesomeIcon icon={faArchive} /></div>
          <span className={sidebarStyles.catagory}>
          Archive
          </span>
        </button>
        <button className={sidebarStyles.child}>
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