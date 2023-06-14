import { z } from 'zod'

export const chartData = z
  .object({
    key: z.string().nullable(),
    value: z.number(),
    meta: z.any().optional(),
  })
  .array()

type ChartData = z.infer<typeof chartData>
export type IChartData<T = any> = ChartData & {
  meta?: T
}
