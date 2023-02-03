import { combineReducers } from '@reduxjs/toolkit'
import { tableReducer } from './table'

export const rootReducer = combineReducers({
  tables: tableReducer,
})

export type RootState = ReturnType<typeof rootReducer>
