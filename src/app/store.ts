import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import {
  branchSlice,
  courseSlice,
  leadSlice,
  roomSlice,
  teacherSlice,
  themeSlice,
} from "./slices";


const store = configureStore({
  reducer: {
    branch: branchSlice.reducer,
    theme: themeSlice.reducer,
    room: roomSlice.reducer,
    teacher: teacherSlice.reducer,
    course: courseSlice.reducer,
    leads: leadSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
