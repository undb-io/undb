import { chartData } from '@undb/core'
import { z } from 'zod'

export const getShareAggregateChartQueryOutput = z.object({
  data: chartData,
})
