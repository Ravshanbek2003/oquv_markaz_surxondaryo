import { createSlice } from "@reduxjs/toolkit";

export const leadSlice = createSlice({
  name: "leads",
  initialState: {
    draggingLead: undefined,
  },
  reducers: {
    setLead: (state, action) => {
      state.draggingLead = action.payload;
    },
  },
});

export const { setLead } = leadSlice.actions;
