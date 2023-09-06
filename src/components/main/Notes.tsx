import React, {useContext} from 'react'
import Create from './Create'
import Note from './Note';
import MainStyles from './MainStyles.module.css'
import Masonry from 'react-masonry-css'
import { Context } from '../../context';
import { notesState } from '../../interfaces';




interface Props {
  notes: notesState
}



const Notes: React.FC<Props> = ({ notes }) => {

  const {currentLabel, loading} = useContext(Context)
  
  const breakpoints = {
    default: 6,
    1200: 5,
    992: 4,
    768: 3,
    576: 2,
    460: 1,
  };


  
  
 

  if (loading) {
    return <div>Loading...</div>;
  }

  return !notes.plainNotes && !notes.pinnedNotes ? (
    <div>No notes available</div>
    ) : (
    <div className={`${MainStyles.container}`}>
      {currentLabel.title !== "Trash" && currentLabel.title !== "Archive" ? (<Create />) : null}
      {/* className={NoteStyles.notesContainer} */}
      <Masonry   
      breakpointCols={breakpoints}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column">

        {notes.pinnedNotes.map((note, index) => (
         <Note key={index} note={note} />
        ))}
        {notes.plainNotes.map((note, index) => (
         <Note key={index} note={note} />
        ))}
      </Masonry>
    </div>
  )}


export default Notes