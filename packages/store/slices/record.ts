import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import 'immer'
import 'reselect'
import type { RootState } from '../reducers'

export interface RecordState {
  selectedRecordId: string
  selectedRecordIds: Record<string, boolean>
}

const initialState: RecordState = {
  selectedRecordId: '',
  selectedRecordIds: {},
}

export const recordSlice = createSlice({
  name: 'record',
  initialState,
  reducers: {
    setSelectedRecordId: (state, action: PayloadAction<string>) => {
      state.selectedRecordId = action.payload
    },
    resetSelectedRecordId: (state) => {
      state.selectedRecordId = ''
    },
    setSelectedRecordIds: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.selectedRecordIds = action.payload
    },
  },
})

export const { setSelectedRecordId, resetSelectedRecordId, setSelectedRecordIds } = recordSlice.actions

export const recordReducer = recordSlice.reducer

const self = (state: RootState) => state

export const getSelectedRecordId = createSelector(self, (state) => state.record.selectedRecordId)

export const getSelectedRecordIds = createSelector(self, (state) => state.record.selectedRecordIds)
