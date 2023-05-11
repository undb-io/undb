import { z } from 'zod'
import {
  chartVirsualization,
  createChartVirsualizationSchema,
  updateChartVirsualizationSchema,
} from './chart.virsualization.js'
import {
  createNumberVirsualizationSchema,
  numberVirsualization,
  updateNumberVirsualizationSchema,
} from './number.virsualization.js'
import type { VirsualizationID, virsualizationIdSchema } from './virsualization-id.vo.js'
import { type VirsualizationName } from './virsualization-name.vo.js'
import type { virsualizationTypeSchema } from './virsualization.schema.js'

export type IVirsualization = {
  id: VirsualizationID
  name: VirsualizationName
  type: IVirsualizationTypeSchema
}

export type IVirsualizationTypeSchema = z.infer<typeof virsualizationTypeSchema>
export type IVirsualizationIdSchema = z.infer<typeof virsualizationIdSchema>

export const createVirsualizationSchema = z.discriminatedUnion('type', [
  createNumberVirsualizationSchema,
  createChartVirsualizationSchema,
])
export type ICreateVirsualizationSchema = z.infer<typeof createVirsualizationSchema>

export const updateVirsualizationSchema = z.discriminatedUnion('type', [
  updateNumberVirsualizationSchema,
  updateChartVirsualizationSchema,
])
export type IUpdateVirsualizationSchema = z.infer<typeof updateVirsualizationSchema>

export const virsualizationSchema = z.discriminatedUnion('type', [numberVirsualization, chartVirsualization])
export type IVirsualizationSchema = z.infer<typeof virsualizationSchema>
