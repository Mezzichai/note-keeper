import React, {useEffect, useRef, useContext} from 'react';
import authStyle from './settingAndAuthStyles.module.css';

import { useAuth0 } from '@auth0/auth0-react'
import { Context } from '../../context/context';
interface Props {
  setSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SettingsModal: React.FC<Props> = ({ setSettingsModal }) => {

  const {theme, setTheme} = useContext(Context)
  const { logout } = useAuth0();
  const divRef = useRef<HTMLDivElement>(null)
  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      setTimeout(()=> {
        if (divRef.current && !divRef.current.contains(event.target as Node)) {
          setSettingsModal(false)
        }
      }, 100)
    };
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
}, []);

  return (
    <div ref={divRef} className={authStyle.container}> 
      <button onClick={() => {theme === "dark" ? setTheme("light") : setTheme("dark")}} className={`${theme}`}>
        {theme === "dark" ? "Enable Light theme" : "Enable Dark theme"}
      </button>
      <button onClick={() => logout()} className={authStyle.signOut}>
        Sign Out
      </button>
    </div>
  )
}

export default SettingsModal