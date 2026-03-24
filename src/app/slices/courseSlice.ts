import { createSlice } from "@reduxjs/toolkit";

export const courseSlice = createSlice({
  name: "course",
  initialState: {
    course: [],
  },
  reducers: {
    setCourse: (state, action) => {
      state.course = action.payload;
    },
  },
});

export const { setCourse } = courseSlice.actions;
