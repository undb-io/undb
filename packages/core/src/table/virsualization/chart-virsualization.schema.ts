import { z } from 'zod'

export const chartData = z
  .object({
    key: z.string().nullable(),
    value: z.number(),
  })
  .array()

export type IChartData = z.infer<typeof chartData>
