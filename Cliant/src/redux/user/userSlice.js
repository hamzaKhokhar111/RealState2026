import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // ---- SIGN IN ----
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // ---- UPDATE USER ----
    updateUserStart: (state) => {
      state.loading = true;
    },
    UpdateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // ---- DELETE USER ----
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // ---- SIGN OUT ----
    SignOutUserStart: (state) => {
      state.loading = true;
    },
    SignOutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    SignOutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { 
  signInStart, 
  signInFailure, 
  signInSuccess, 
  updateUserFailure, 
  UpdateUserSuccess, 
  updateUserStart,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  SignOutUserFailure,
  SignOutUserSuccess,
  SignOutUserStart
} = userSlice.actions;

export default userSlice.reducer;
