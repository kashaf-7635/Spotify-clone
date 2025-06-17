import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    userData: null,
  },
  reducers: {
    authenticate: (state, action) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userData = action.payload.userData;
    },
  },
});

export const {authenticate} = authSlice.actions;
export default authSlice.reducer;
