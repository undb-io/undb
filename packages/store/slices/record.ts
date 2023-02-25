import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import 'immer'
import { filter, keys, omit, pipe, prop, some, T } from 'lodash/fp'
import 'reselect'
import type { RootState } from '../reducers'
import { recordApi } from '../services'
import { resetCurrentTableId, setCurrentTableId } from './table'

export interface RecordState {
  selectedRecordId: string
  selectedRecordIds: Record<string, Record<string, boolean>>
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
    setTableSelectedRecordIds: (state, action: PayloadAction<{ tableId: string; ids: Record<string, boolean> }>) => {
      state.selectedRecordIds[action.payload.tableId] = action.payload.ids
    },
    resetTableSelectedRecordIds: (state, action: PayloadAction<string>) => {
      delete state.selectedRecordIds[action.payload]
    },
    resetSelectedRecordIds: (state) => {
      state.selectedRecordIds = initialState.selectedRecordIds
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setCurrentTableId, (state) => {
        state.selectedRecordId = initialState.selectedRecordId
      })
      .addCase(resetCurrentTableId, (state) => {
        state.selectedRecordId = initialState.selectedRecordId
      })
      .addMatcher(recordApi.endpoints.deleteRecord.matchFulfilled, (state, action) => {
        const id = action.meta.arg.originalArgs.id
        if (state.selectedRecordId === id) {
          state.selectedRecordId = initialState.selectedRecordId
        }
      })
      .addMatcher(recordApi.endpoints.BulkDeleteRecords.matchFulfilled, (state, action) => {
        const { ids, tableId } = action.meta.arg.originalArgs
        state.selectedRecordIds = omit(ids, state.selectedRecordIds[tableId])
      })
      .addMatcher(recordApi.endpoints.bulkDuplicateRecord.matchFulfilled, (state, action) => {
        delete state.selectedRecordIds[action.meta.arg.originalArgs.tableId]
      })
  },
})

export const { setSelectedRecordId, resetSelectedRecordId, setTableSelectedRecordIds, resetSelectedRecordIds } =
  recordSlice.actions

export const recordReducer = recordSlice.reducer

export const getSelectedRecordId = (state: RootState) => state.record.selectedRecordId

export const getHasSelectedRecordId = createSelector(getSelectedRecordId, Boolean)

export const getSelectedRecordIds = (state: RootState) => state.record.selectedRecordIds

export const getTableSelectedRecordIds = createSelector(
  [getSelectedRecordIds, (_: RootState, tableId: string) => tableId],
  (ids, tableId) => ids[tableId] ?? {},
)

export const getTableSelectedRecordIdList = createSelector(getTableSelectedRecordIds, keys)

export const getTableSelectedRecordIdsCount = createSelector(getTableSelectedRecordIds, pipe(filter(T), prop('length')))

export const getTableHasSelectedRecordIds = createSelector(getTableSelectedRecordIds, some(T))
