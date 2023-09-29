import { LabelType } from "../interfaces";
import makeRequest from "./makeRequests";

export function getNotes(labelId: string) {
  return makeRequest(`/notes/${labelId}`)
}


export function createNote(label:LabelType, title?: string, body?: string) {
  const requestData = {
    title,
    body,
    labels: [label]
  };
  return makeRequest(`/notes/newnote`, {
    method: "POST",
    data: requestData
  })
}

interface noteState {
  isPinned?: boolean,
  isArchived?: boolean,
  isTrashed?: boolean
}

interface updateNoteArgs {
  body: string, 
  title: string,
  id: string
  options: noteState
}

export function updateNote({body, title, id, options}: updateNoteArgs) {
  const requestData = {
    body,
    title,
    ...options
  };
  return makeRequest(`/notes/${id}`, {
    method: "PATCH",
    data: requestData
  })
}

export function deleteNote(id: string) {
  return makeRequest(`/notes/${id}`, {
    method: "DELETE"
  })
}