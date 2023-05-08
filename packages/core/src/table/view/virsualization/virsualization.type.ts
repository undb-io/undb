import { z } from 'zod'
import type { VirsualizationID } from './virsualization-id.vo'

export const virsualizationTypeSchema = z.enum(['number'])
export type IVirsualizationTypeSchema = z.infer<typeof virsualizationTypeSchema>

export const virsualizationIdSchema = z.string().startsWith('vir')
export type IVirsualizationIdSchema = z.infer<typeof virsualizationIdSchema>

export const virsualizationSchema = z.object({
  id: virsualizationIdSchema,
  type: virsualizationTypeSchema,
})

export type IVirsualizationSchema = z.infer<typeof virsualizationSchema>

export type IVirsualization = {
  id: VirsualizationID
  type: IVirsualizationTypeSchema
}
