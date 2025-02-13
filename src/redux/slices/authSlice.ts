import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Company, User } from '../../Utils/Interfaces/interface';

interface AuthState {
  user: User | null;
  company: Company | null;
  token: string | null;
  // jobSeekerProfile: JobSeekerProfile | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  company: null,
  token: null,
  // jobSeekerProfile :null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLogin: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // state.jobSeekerProfile = action.payload.jobSeekerProfile;
    },
    companyLogin: (
      state,
      action: PayloadAction<{ company: Company; token: string; user?: User }>
    ) => {
      state.company = action.payload.company;
      state.user = action.payload.user || null;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    companyUpdate: (state, action: PayloadAction<Company>) => {
      state.company = action.payload;
    },
    userUpdate: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    // jobSeekerProfileUpdate: (state, action: PayloadAction<JobSeekerProfile>) => {
    //   state.jobSeekerProfile = action.payload;
    // },
    logout: (state) => {
      state.user = null;
      state.company = null;
      state.token = null;
      state.isAuthenticated = false;
      // state.jobSeekerProfile = null;
    },
  },
});

export const { userLogin, companyLogin, logout, companyUpdate, userUpdate } =
  authSlice.actions;

export default authSlice.reducer;
