import { combineReducers } from '@reduxjs/toolkit'
import { api } from '../services'
import { recordReducer, recordSlice } from '../slices/record'

export const rootReducer = combineReducers({
  [recordSlice.name]: recordReducer,
  [api.reducerPath]: api.reducer,
})

export type RootState = ReturnType<typeof rootReducer>
