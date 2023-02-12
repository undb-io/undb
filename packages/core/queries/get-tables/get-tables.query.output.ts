import * as z from 'zod'
import { getTableQueryOutput } from '../get-table/get-table.query.output.js'

export const getTablesQueryOutput = z.array(getTableQueryOutput.unwrap())
