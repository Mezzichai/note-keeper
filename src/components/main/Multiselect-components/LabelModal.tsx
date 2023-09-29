import React, {useRef, useEffect, useState } from 'react'
import { useLabels } from '../../../context/LabelContext';
import optionModalStyles from '../../header/optionModalStyles.module.css'
import { NoteType } from '../../../interfaces';
import { LabelType } from '../../../interfaces';

interface Props {
  setLabelModal: React.Dispatch<React.SetStateAction<boolean>>;
  note: NoteType
}

const LabelModal: React.FC<Props> = ({setLabelModal, note}) => {
  const {labels} = useLabels()
  const labelModalRef = useRef<HTMLDivElement>(null)
  const [checkedLabels, setCheckedLabels] = useState<LabelType[]>([...note.labels])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setTimeout(()=> {
        if ((labelModalRef.current && !labelModalRef.current.contains(event.target as Node))) {
          setLabelModal(false);
        }
      }, 100)
    };
  
    document.addEventListener("mousedown", handleClickOutside);
   
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };  
  }, [setLabelModal, note.labels]);




  const handleLabelChange = (label: LabelType, e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    setCheckedLabels(prevCheckedLabels => {
      if (prevCheckedLabels.some(checkedLabel => checkedLabel._id === label._id)) {
        return prevCheckedLabels.filter(checkedLabel => checkedLabel._id !== label._id)
      } else {
        return [...prevCheckedLabels, label]
      }
    })
  }
  
  useEffect(() => {
    console.log(checkedLabels)
    const handleLabelsUpdate = async () => {
      await api.patch(
        `./notes/${note._id}`,
        JSON.stringify({ labels: [...checkedLabels] }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
    }
    handleLabelsUpdate()
    //direct state mutation 
    note.labels = [...checkedLabels]
  }, [checkedLabels, note._id])

  return (
    <div ref={labelModalRef} className={optionModalStyles.labelModal}>
      <span className={optionModalStyles.title}>Label Note</span>
      
      {labels.map(label=> {
        return (
          <div key={label._id || label.title} className={optionModalStyles.label} onClick={(e) => handleLabelChange(label, e)}>
             <input
              type="checkbox"
              value={label.title}
              checked={checkedLabels.some(checkedLabels => checkedLabels._id === label._id)}
              readOnly
            />
            <span>{label.title}</span>
          </div>
        )
      })}
    </div>
  )
}

export default LabelModal