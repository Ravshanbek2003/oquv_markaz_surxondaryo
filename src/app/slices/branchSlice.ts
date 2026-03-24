import { createSlice } from "@reduxjs/toolkit";

export const branchSlice = createSlice({
  name: "branch",
  initialState: {
    branch: "",
  },
  reducers: {
    setBranch: (state, action) => {
      localStorage.setItem("branch", action.payload);
      state.branch = action.payload;
    },
    removeBranch: (state) => {
      state.branch = "";
      localStorage.removeItem("branch");
    },
  },
});

export const { setBranch, removeBranch } = branchSlice.actions;
