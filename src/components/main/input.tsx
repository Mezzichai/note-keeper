import React, {useRef} from 'react'
import NoteStyles from './NoteStyles.module.css'



const ResizableInput: React.FC<Props> = ({ value, onChange, onFocus, className,  }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInput = () => {
    if (inputRef.current) {
      inputRef.current.style.width = 'auto';
      inputRef.current.style.width = `${inputRef.current.scrollWidth}px`;
    }
  };

  return (
    <input
      className={NoteStyles[className]}
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onInput={handleInput}
    />
  );
};

export default ResizableInput;