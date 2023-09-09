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
  console.log('Notes component is rendering with notes:', notes);

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

  return (!notes.plainNotes && !notes.pinnedNotes) || (notes.plainNotes.length === 0 && ["Query", "Trash", "Archive"].includes(currentLabel.title)) ? (
    <div className={`${MainStyles.container}`}>
      <div className={MainStyles.noNotes}>No notes found!</div>
    </div>
    ) : (
    <div className={MainStyles.container}>
      {!["Trash", "Archive", "Query"].includes(currentLabel.title) ? (<Create />) : null}
      {/* className={NoteStyles.notesContainer} */}
      <Masonry   
      breakpointCols={breakpoints}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column">

        {notes.pinnedNotes.map((note) => (
         <Note key={note._id} note={note} />
        ))}
        {notes.plainNotes.map((note) => (
         <Note key={note._id} note={note} />
        ))}
      </Masonry>
    </div>
  )}


export default Notes