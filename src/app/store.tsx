import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    labels: labelReducer;
    notes: noteReducer
    isSideBarOpen: sidebarReducer
  }
})