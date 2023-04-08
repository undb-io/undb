import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import type { RootState } from '../reducers'
import { authApi } from '../services'

export interface AuthState {
  token?: string
}

const initialState: AuthState = {}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    resetToken: (state) => {
      state.token = undefined
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.me.matchRejected, (state, action) => {
        if (action.payload?.status === 401) {
          state.token = undefined
        }
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.token = action.payload.access_token
      })
  },
})

export const { setToken, resetToken } = authSlice.actions

export const authReducer = persistReducer(
  {
    key: authSlice.name,
    storage,
  },
  authSlice.reducer,
)

export const getIsAuthorized = (state: RootState) => !!state.auth.token
