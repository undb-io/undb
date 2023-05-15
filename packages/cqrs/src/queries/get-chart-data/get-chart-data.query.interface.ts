import type * as z from 'zod'
import type { getChartDataQueryOutput } from './get-chart-data.query.output.js'
import type { getChartDataQuerySchema } from './get-chart-data.query.schema.js'

export type IGetChartDataQuery = z.infer<typeof getChartDataQuerySchema>
export type IGetChartDataOutput = z.infer<typeof getChartDataQueryOutput>
