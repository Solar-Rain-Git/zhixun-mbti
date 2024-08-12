import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isLoggedIn: boolean;
  userInfo: {
    nickname: string;
    avatar: string;
  } | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  userInfo: null,
};

const userSlice = createSlice({
  name: 'userStore',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ nickname: string; avatar: string }>) => {
      state.isLoggedIn = true;
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userInfo = null;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;

