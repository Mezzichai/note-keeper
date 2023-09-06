const outsideClick = (ref: React.RefObject<HTMLDivElement>, action: React.Dispatch<React.SetStateAction<boolean>> | (() => Promise<void>), payload?: boolean) => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        payload !== undefined ? action(payload) : action(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
   
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
}

export default outsideClick