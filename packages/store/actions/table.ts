import type { IQueryTable } from '@egodb/core'
import { createAction } from '@reduxjs/toolkit'

export const getTables = createAction('tables/getTables')

export const receiveTables = createAction<{ tables: IQueryTable[] }>('tables/receiveTables')
