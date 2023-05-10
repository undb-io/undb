import { z } from 'zod'
import { createNumberVirsualizationSchema, updateNumberVirsualizationSchema } from './number.virsualization.js'
import type { VirsualizationID, virsualizationIdSchema } from './virsualization-id.vo.js'
import { type VirsualizationName } from './virsualization-name.vo.js'
import type { virsualizationSchema, virsualizationTypeSchema } from './virsualization.schema.js'

export type IVirsualization = {
  id: VirsualizationID
  name: VirsualizationName
  type: IVirsualizationTypeSchema
}

export type IVirsualizationTypeSchema = z.infer<typeof virsualizationTypeSchema>
export type IVirsualizationIdSchema = z.infer<typeof virsualizationIdSchema>
export type IVirsualizationSchema = z.infer<typeof virsualizationSchema>

export const createVirsualizationSchema = z.discriminatedUnion('type', [createNumberVirsualizationSchema])
export type ICreateVirsualizationSchema = z.infer<typeof createVirsualizationSchema>

export const updateVirsualizationSchema = z.discriminatedUnion('type', [updateNumberVirsualizationSchema])
export type IUpdateVirsualizationSchema = z.infer<typeof updateVirsualizationSchema>
