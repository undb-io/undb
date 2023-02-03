import type { IQueryTable } from '@egodb/core'
import { createEntityAdapter, createReducer } from '@reduxjs/toolkit'
import * as actions from '../actions'

const tableAdapter = createEntityAdapter<IQueryTable>({
  selectId: (table) => table.id,
})

export const tableReducer = createReducer(tableAdapter.getInitialState(), (builder) =>
  builder.addCase(actions.receiveTables, (state, action) => tableAdapter.setAll(state, action.payload.tables)),
)
