import React, {useRef} from 'react'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import headerStyles from './headerStyles.module.css'

interface Props {
  query: string, 
  setQuery: React.Dispatch<React.SetStateAction<string>>, 
  currentLabel: string
}

const SearchBar:React.FC<Props> = ({query, setQuery, currentLabel}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFocusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }
  return (
    <>
      <button onClick={() => handleFocusInput()}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
        <input 
          ref={inputRef}
          placeholder={`Search ${currentLabel}`}
          type="text" 
          value={query}
          onChange={(e) =>  setQuery(e.target.value)}
        />
      <button className={headerStyles.X} onClick={() => setQuery("")}>X</button>
    </>
  )
}

export default SearchBar