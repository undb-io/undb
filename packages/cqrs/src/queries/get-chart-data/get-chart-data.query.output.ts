import { chartData } from '@undb/core'
import { z } from 'zod'

export const getChartDataQueryOutput = z.object({
  data: chartData,
})
