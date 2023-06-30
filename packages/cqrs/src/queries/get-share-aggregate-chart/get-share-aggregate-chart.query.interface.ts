import type * as z from 'zod'
import type { getShareAggregateChartQueryOutput } from './get-share-aggregate-chart.query.output.js'
import type { getShareAggregateChartQuerySchema } from './get-share-aggregate-chart.query.schema.js'

export type IGetShareAggregateChartQuery = z.infer<typeof getShareAggregateChartQuerySchema>
export type IGetShareAggregateChartOutput = z.infer<typeof getShareAggregateChartQueryOutput>
