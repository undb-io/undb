import { z } from 'zod'

export const chartData = z
  .object({
    key: z.string(),
    value: z.number(),
  })
  .array()

export type IChartData = z.infer<typeof chartData>
