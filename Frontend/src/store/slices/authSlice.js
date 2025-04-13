// src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Get token and user from localStorage instead of cookie
const token = localStorage.getItem("token");
const userDetails = localStorage.getItem("userDetails");

const initialState = {
  user: userDetails ? JSON.parse(userDetails) : null,
  token: token || null,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      // Persist to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userDetails", JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("userDetails");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
