import * as z from 'zod'
import { getTableQueryOutput } from '../get-table/get-table.query.output'

export const getTablesQueryOutput = z.array(getTableQueryOutput)
