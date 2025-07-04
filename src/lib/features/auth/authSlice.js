import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// Helper function for consistent error handling
const handleAuthError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.error || 'Authentication failed',
      status: error.response.status,
      isNetworkError: false
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'Network error - unable to reach server',
      status: null,
      isNetworkError: true
    };
  }
  // Other errors
  return {
    message: error.message || 'An unexpected error occurred',
    status: null,
    isNetworkError: false
  };
};

// Async Thunk for User Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, 
        { email, password },
        { withCredentials: true }
      );
      
      return {
        user: response.data.user,
        timestamp: Date.now()
      };
    } catch (error) {
      console.log("error at login slice:", error);
      
      // Handle different error cases
      if (error.response) {
        const { status, data } = error.response;
        
        // Email not verified - status 403
        if (status === 403) {
          return rejectWithValue({
            status: 403,
            message: data.message || 'Your email is not verified. Please verify your email to continue.',
            needsVerification: true,
            email: email
          });
        }
        
        // Invalid credentials - status 401
        if (status === 401) {
          return rejectWithValue({
            status: 401,
            message: 'Invalid email or password. Please try again.'
          });
        }
        
        // Bad request - status 400
        if (status === 400) {
          return rejectWithValue({
            status: 400,
            message: data.message || 'Invalid request. Please check your input.'
          });
        }
        
        // Server error - status 500
        if (status === 500) {
          return rejectWithValue({
            status: 500,
            message: 'Invalid credentials , try again . '
          });
        }
        
        // Other HTTP errors
        return rejectWithValue({
          status: status,
          message: data.message || 'Login failed. Please try again.'
        });
      } else if (error.request) {
        // Network error
        return rejectWithValue({
          status: 'NETWORK_ERROR',
          message: 'Network error. Please check your connection and try again.'
        });
      } else {
        // Other errors
        return rejectWithValue({
          status: 'UNKNOWN_ERROR',
          message: 'An unexpected error occurred. Please try again.'
        });
      }
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (googleAuthData, { rejectWithValue }) => {
    try {
      // Use axios as it's already used for loginUser and handles JSON stringification
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/google-login`, // Your backend's Google login endpoint
        googleAuthData, // Data from Next-Auth, backend expects it as is
        { withCredentials: true } // Crucial for sending/receiving cookies
      );
      setTimeout(() => {
        
        // console.log("google auth api call response", response.data)
      }, 5000);
      return {

        user: response.data.user,
        timestamp: Date.now()
      };
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

// Async Thunk for Checking Auth Status with caching
export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    
    // Skip if we recently checked (5 minute cache)
    if (auth.lastChecked && (Date.now() - auth.lastChecked < 300000)) {
      return;
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/status`, {
        withCredentials: true,
      });
      return {
        user: response.data,
        timestamp: Date.now()
      };
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

// Async Thunk for User Logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, {
        withCredentials: true,
      });
      return { timestamp: Date.now() };
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

// Redux Slice for Authentication
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    isAdmin: false,
    lastChecked: null,
    initialized: false
  },
  reducers: {
    // Manual state reset
    resetAuth: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.lastChecked = null;
    },
    // Silent refresh for token updates
    updateAuthToken: (state, action) => {
      if (state.user) {
        state.user.accessToken = action.payload.token;
        state.lastChecked = Date.now();
      }
    }
  },
  extraReducers: (builder) => {
  builder
    // Login User Cases
    .addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.user.role === 'admin';
      state.lastChecked = action.payload.timestamp;
      state.initialized = true;
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.initialized = true;
    })

    // Google Login Cases
    .addCase(googleLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(googleLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.user.role === 'admin';
      state.lastChecked = action.payload.timestamp;
      state.initialized = true;
    })
    .addCase(googleLogin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.initialized = true;
    })

    // Check Auth Status Cases
    .addCase(checkAuthStatus.pending, (state) => {
      if (!state.initialized) {
        state.loading = true;
      }
      state.error = null;
    })
    .addCase(checkAuthStatus.fulfilled, (state, action) => {
      if (action.payload) {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.user.role === 'admin';
        state.lastChecked = action.payload.timestamp;
      }
      state.initialized = true;
    })
    .addCase(checkAuthStatus.rejected, (state, action) => {
      state.loading = false;
      if (action.payload?.status === 401 || action.payload?.status === 403) {
        state.user = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
      }
      state.error = action.payload;
      state.initialized = true;
    })

    // Logout User Cases
    .addCase(logoutUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(logoutUser.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.lastChecked = null;
    })
    .addCase(logoutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
}

});

export const { resetAuth, updateAuthToken } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.isAdmin;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthInitialized = (state) => state.auth.initialized;

export default authSlice.reducer;