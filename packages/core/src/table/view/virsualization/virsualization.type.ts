import { z } from 'zod'

export const virsualizationTypeSchema = z.enum(['number'])
export type IVirsualizationTypeSchema = z.infer<typeof virsualizationSchema>

export const virsualizationSchema = z.object({
  type: virsualizationTypeSchema,
})

export type IVirsualizationSchema = z.infer<typeof virsualizationSchema>

export type IVirsualization = {
  type: IVirsualizationTypeSchema
}
