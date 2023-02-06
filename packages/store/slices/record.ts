import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import 'immer'
import 'reselect'
import type { RootState } from '../reducers'

export interface RecordState {
  selectedRecordId: string
}

const initialState: RecordState = {
  selectedRecordId: '',
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
  },
})

export const { setSelectedRecordId, resetSelectedRecordId } = recordSlice.actions

export const recordReducer = recordSlice.reducer

export const getSelectedRecordId = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.record.selectedRecordId,
)
