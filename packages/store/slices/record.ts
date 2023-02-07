import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import 'immer'
import { filter, some } from 'lodash'
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
      state.selectedRecordId = initialState.selectedRecordId
    },
    setSelectedRecordIds: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.selectedRecordIds = action.payload
    },
    resetSelectedRecordIds: (state) => {
      state.selectedRecordIds = initialState.selectedRecordIds
    },
  },
})

export const { setSelectedRecordId, resetSelectedRecordId, setSelectedRecordIds, resetSelectedRecordIds } =
  recordSlice.actions

export const recordReducer = recordSlice.reducer

export const getSelectedRecordId = (state: RootState) => state.record.selectedRecordId

export const getSelectedRecordIds = (state: RootState) => state.record.selectedRecordIds

export const getSelectedRecordIdsCount = createSelector(
  getSelectedRecordIds,
  (ids) => filter(ids, (selected) => selected === true).length,
)

export const getHasSelectedRecordIds = createSelector(getSelectedRecordIds, (ids) =>
  some(ids, (selected) => selected === true),
)
