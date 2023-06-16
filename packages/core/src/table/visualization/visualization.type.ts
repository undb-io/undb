import { z } from 'zod'
import {
  chartVisualization,
  createChartVisualizationSchema,
  updateChartVisualizationSchema,
} from './chart.visualization.js'
import {
  createNumberVisualizationSchema,
  numberVisualization,
  updateNumberVisualizationSchema,
} from './number.visualization.js'
import type { VisualizationID, visualizationIdSchema } from './visualization-id.vo.js'
import { type VisualizationName } from './visualization-name.vo.js'
import type { visualizationTypeSchema } from './visualization.schema.js'

export type IVisualization = {
  id: VisualizationID
  name: VisualizationName
  type: IVisualizationTypeSchema
}

export type IVisualizationTypeSchema = z.infer<typeof visualizationTypeSchema>
export type IVisualizationIdSchema = z.infer<typeof visualizationIdSchema>

export const createVisualizationSchema = z.discriminatedUnion('type', [
  createNumberVisualizationSchema,
  createChartVisualizationSchema,
])
export type ICreateVisualizationSchema = z.infer<typeof createVisualizationSchema>

export const updateVisualizationSchema = z.discriminatedUnion('type', [
  updateNumberVisualizationSchema,
  updateChartVisualizationSchema,
])
export type IUpdateVisualizationSchema = z.infer<typeof updateVisualizationSchema>

export const visualizationSchema = z.discriminatedUnion('type', [numberVisualization, chartVisualization])
export type IVisualizationSchema = z.infer<typeof visualizationSchema>
