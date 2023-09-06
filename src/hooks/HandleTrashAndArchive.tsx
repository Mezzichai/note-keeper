import React from "react";
import api from "../api/axios";
import { NoteType } from "../interfaces";

interface UpdateNoteObject {
  e: React.MouseEvent;
  note: NoteType;
  shouldBeArchived: boolean;
  shouldBeTrashed: boolean;
}

const UseUpdateNoteStatus = (obj: UpdateNoteObject) => {

  const {e, note, shouldBeArchived, shouldBeTrashed} = obj
  e.stopPropagation();

  const updateNote = async() => {
    try {
      const updatedNote = await api.patch(`./notes/${note._id}`, 
      JSON.stringify({isArchived: shouldBeArchived, isTrashed: shouldBeTrashed}),
      {
        headers: { "Content-Type": "application/json"},
        withCredentials: true
      })
      console.log(updatedNote)
    } catch (error) {
      throw new Error(`Error updating note: ${error}`);
    }
  }
  updateNote()
}


export default UseUpdateNoteStatus