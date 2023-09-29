import React from 'react'
import Create from './Create'
import Note from './Note';
import MainStyles from './MainStyles.module.css'
import Masonry from 'react-masonry-css'
import { useNotes } from '../../context/NoteContext';
import { useParams } from 'react-router-dom';

const Notes: React.FC = () => {

  const { notes } = useNotes()
  const { labelId } = useParams()
  // useEffect(() => {
  //   if (currentLabel.title !== "Query") {
  //     const getNotes = async () => {
  //       try {
  //         const response = await api.get(`./notes/${id}`);
  //         setNotes(() => ({ plainNotes: response.data.plainNotes, pinnedNotes: response.data.pinnedNotes }));
  //         setLoading(false)
  //     } catch (error) {
  //         console.error('Error fetching notes:', error);
  //       }
  //     };
  //     getNotes()
  //   }
  // }, [currentLabel]);

  // console.log('Notes component is rendering with notes:', notes);

  
  const breakpoints = {
    default: 6,
    1200: 5,
    992: 4,
    768: 3,
    576: 2,
    460: 1,
  };

  return (!notes.plainNotes && !notes.pinnedNotes) || ((notes.plainNotes.length === 0) && 
    (["Trash", "Archive"].includes(labelId || ""))) ? (
    <div className={`${MainStyles.container}`}>
      <div className={MainStyles.noNotes}>No notes found!</div>
    </div>
    ) : (
    <div className={MainStyles.container}>
      {!["Trash", "Archive"].includes(labelId || "") ? (<Create />) : null}
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