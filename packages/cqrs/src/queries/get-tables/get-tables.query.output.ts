import { queryTable } from '@undb/core'
import * as z from 'zod'

export const getTablesQueryOutput = z.array(queryTable)
