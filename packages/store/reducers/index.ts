import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/es/storage'
import { api, attachment, authApi, userApi } from '../services'
import { tableReducer, tableSlice } from '../slices'
import { authReducer, authSlice } from '../slices/auth'
import { recordReducer, recordSlice } from '../slices/record'

export const reducer = combineReducers({
  [recordSlice.name]: recordReducer,
  [tableSlice.name]: tableReducer,
  [authSlice.name]: authReducer,
  [api.reducerPath]: api.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [attachment.reducerPath]: attachment.reducer,
  [authApi.reducerPath]: authApi.reducer,
})

export const rootReducder = persistReducer(
  {
    key: 'root',
    version: 1,
    storage,
    blacklist: [api.reducerPath, recordSlice.name, userApi.reducerPath],
  },
  reducer,
)

export type RootState = ReturnType<typeof reducer>
