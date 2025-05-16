import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Company, User } from '../../Utils/Interfaces/interface';

interface AuthState {
  user: User | null;
  company: Company | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  company: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLogin: (
      state,
      action: PayloadAction<{ user: User }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    companyLogin: (
      state,
      action: PayloadAction<{ company: Company; user?: User }>
    ) => {
      state.company = action.payload.company;
      state.user = action.payload.user || null;
      state.isAuthenticated = true;
    },
    companyUpdate: (state, action: PayloadAction<Company>) => {
      state.company = action.payload;
    },
    userUpdate: (state, action: PayloadAction<User>) => {
      console.log("user reached in redx",action.payload)
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.company = null;
      state.isAuthenticated = false;
    },
  },
});

export const { userLogin, companyLogin, logout, companyUpdate, userUpdate } =
  authSlice.actions;

export default authSlice.reducer;
