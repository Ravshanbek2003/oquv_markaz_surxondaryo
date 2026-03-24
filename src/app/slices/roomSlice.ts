import { createSlice } from "@reduxjs/toolkit";

export const roomSlice = createSlice({
  name: "room",
  initialState: {
    room: [],
  },
  reducers: {
    setRoom: (state, action) => {
      state.room = action.payload;
    },
  },
});

export const { setRoom } = roomSlice.actions;
