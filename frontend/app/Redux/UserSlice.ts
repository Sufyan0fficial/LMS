import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../types/apifn.types";

export interface UserState {
  user: Partial<IUser>;
}

const initialState: UserState = {
  user: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    dispatchUserData: (state, action) => {
      state.user = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { dispatchUserData } = userSlice.actions;

export default userSlice.reducer;
