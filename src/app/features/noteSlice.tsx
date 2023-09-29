import { createSlice } from "@reduxjs/toolkit"

export const noteSlice = createSlice({
  name: "notes",
  initialState: {
    pinnedNotes: [],
    plainNotes: []
  },
  reducers: {
    getNotes
  }
})