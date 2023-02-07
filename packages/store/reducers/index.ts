import { combineReducers } from '@reduxjs/toolkit'
import { api } from '../services'
import { tableReducer, tableSlice } from '../slices'
import { recordReducer, recordSlice } from '../slices/record'

export const rootReducer = combineReducers({
  [recordSlice.name]: recordReducer,
  [tableSlice.name]: tableReducer,
  [api.reducerPath]: api.reducer,
})

export type RootState = ReturnType<typeof rootReducer>
