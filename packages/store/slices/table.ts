import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import 'immer'
import 'reselect'
import type { RootState } from '../reducers'
import { tableApi } from '../services'

export interface TableState {
  currentTableId: string
  totalCount: number
}

const initialState: TableState = {
  currentTableId: '',
  totalCount: 0,
}

export const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setCurrentTableId: (state, action: PayloadAction<string>) => {
      state.currentTableId = action.payload
    },
    resetCurrentTableId: (state) => {
      state.currentTableId = ''
    },
  },
  extraReducers(builder) {
    builder.addMatcher(tableApi.endpoints.getTables.matchFulfilled, (state, action) => {
      state.totalCount = action.payload?.ids.length ?? 0
    })
  },
})

export const { setCurrentTableId, resetCurrentTableId } = tableSlice.actions

export const tableReducer = tableSlice.reducer

const self = (state: RootState) => state

export const getCurrentTableId = createSelector(self, (state) => state.table.currentTableId)

export const getTotalCount = createSelector(self, (state) => state.table.totalCount)
