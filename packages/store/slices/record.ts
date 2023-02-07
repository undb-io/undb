import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import 'immer'
import { filter, keys, omit, pipe, prop, some, T } from 'lodash/fp'
import 'reselect'
import type { RootState } from '../reducers'
import { recordApi } from '../services'

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
  extraReducers: (builder) => {
    builder
      .addMatcher(recordApi.endpoints.deleteRecord.matchFulfilled, (state, action) => {
        const id = action.meta.arg.originalArgs.id
        if (state.selectedRecordId === id) {
          state.selectedRecordId = initialState.selectedRecordId
        }
      })
      .addMatcher(recordApi.endpoints.bulkdDeleteRecords.matchFulfilled, (state, action) => {
        const ids = action.meta.arg.originalArgs.ids
        state.selectedRecordIds = omit(ids, state.selectedRecordIds)
      })
  },
})

export const { setSelectedRecordId, resetSelectedRecordId, setSelectedRecordIds, resetSelectedRecordIds } =
  recordSlice.actions

export const recordReducer = recordSlice.reducer

export const getSelectedRecordId = (state: RootState) => state.record.selectedRecordId

export const getSelectedRecordIds = (state: RootState) => state.record.selectedRecordIds

export const getSelectedRecordIdList = createSelector(getSelectedRecordIds, keys)

export const getSelectedRecordIdsCount = createSelector(getSelectedRecordIds, pipe(filter(T), prop('length')))

export const getHasSelectedRecordIds = createSelector(getSelectedRecordIds, some(T))
