import React, { useState } from 'react';
import headerStyles from "./headerStyles.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faBars, faUser } from '@fortawesome/free-solid-svg-icons';

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  const [query, setQuery] = useState<string>("");



  
  return (
    <header>
      <div className={headerStyles.left}>
        <button onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      <div className={headerStyles.center}>
        <button>Search</button>
        <input 
          placeholder='Search'
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button>X</button>
      </div>

      <div className={headerStyles.right}>
        <button className={headerStyles.option}>
          <FontAwesomeIcon icon={faGear} />
        </button>
        <button className={headerStyles.option}>
          <FontAwesomeIcon icon={faGear} />
        </button>
        <button className={headerStyles.option}>
          <FontAwesomeIcon icon={faUser} />
        </button>
      </div>
    </header>
  )
}

export default Header;