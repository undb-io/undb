import { z } from 'zod'

export const getChartDataQueryOutput = z.object({
  // TODO: type
  data: z.any(),
})
