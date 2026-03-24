import { createSlice } from "@reduxjs/toolkit";

export const teacherSlice = createSlice({
  name: "teacher",
  initialState: {
    teacher: [],
    teacherId: "",
  },

  reducers: {
    setTeacher: (state, action) => {
      state.teacher = action.payload;
    },

    setTeacherId: (state, action) => {
      state.teacherId = action.payload;
    },
  },
});

export const { setTeacher, setTeacherId } = teacherSlice.actions;
