import React, {useRef, useEffect, useContext, useState } from 'react'
import { Context } from '../../../context';
import optionModalStyles from '../../header/optionModalStyles.module.css'
import { NoteType } from '../../../interfaces';
import { LabelType } from '../../../interfaces';

interface Props {
  setLabelModal: React.Dispatch<React.SetStateAction<boolean>>;
  note: NoteType
}

const LabelModal: React.FC<Props> = ({setLabelModal, note}) => {
  const {labels} = useContext(Context)
  const labelModalRef = useRef<HTMLDivElement>(null)
  const [checkedLabels, setCheckedLabels] = useState<LabelType[]>([])
  useEffect(() => {
   
    const handleClickOutside = (event: MouseEvent) => {
      // setTimeout(()=> {
        if ((labelModalRef.current && !labelModalRef.current.contains(event.target as Node))) {
          setLabelModal(false);
        }
      // }, 100)
    };
  
    document.addEventListener("mousedown", handleClickOutside);
   
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };  
  }, [setLabelModal, note.labels]);


  const handleLabelChange = (label: LabelType) => {
    setCheckedLabels(prevCheckedLabels => {
      if (prevCheckedLabels.some(checkedLabel => checkedLabel._id === label._id)) {
        return prevCheckedLabels.filter(checkedLabel => checkedLabel._id !== label._id)
      } else {
        return [...prevCheckedLabels, label]
      }
    })
  }

  return (
    <div ref={labelModalRef} className={optionModalStyles.labelModal}>
      <span className={optionModalStyles.title}>Label Note</span>
      
      {labels.map(label=> {
        return (
          <div key={label._id || label.title} className={optionModalStyles.label}>
             <input
              type="checkbox"
              checked={note.labels.some(noteLabel => noteLabel._id === label._id)}
              onChange={() => handleLabelChange(label)}
            />
            <span>{label.title}</span>
          </div>
        )
      })}
    </div>
  )
}

export default LabelModal