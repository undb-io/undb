import { z } from 'zod'
import { FieldId, fieldIdSchema } from '../field/index.js'
import { WithVisualizationFieldSpec } from './specifications/visualization-field.specification.js'
import { VisualizationID } from './visualization-id.vo.js'
import {
  baseCreateVisualizationSchema,
  baseUpdateVisualizationSchema,
  baseVisualizationSchema,
} from './visualization.schema.js'
import type { IVisualization } from './visualization.type.js'
import { type IVisualizationTypeSchema } from './visualization.type.js'
import type { IVisualizationVisitor } from './visualization.visitor.js'
import { VisualizationVO } from './visualization.vo.js'

export const chartTypeSchema = z.enum(['bar'])
export type IChartType = z.infer<typeof chartTypeSchema>

export const chartAggregateFunction = z.enum(['count'])

export type IChartAggregateFunction = z.infer<typeof chartAggregateFunction>

export const chartAggregateFunctions: IChartAggregateFunction[] = ['count']

export const createChartVisualizationSchema = z
  .object({
    type: z.literal('chart'),
    chartType: chartTypeSchema,
    fieldId: fieldIdSchema.optional(),
    chartAggregateFunction: chartAggregateFunction.optional(),
  })
  .merge(baseCreateVisualizationSchema)

export const updateChartVisualizationSchema = z
  .object({
    type: z.literal('chart'),
    fieldId: fieldIdSchema.optional(),
    chartAggregateFunction: chartAggregateFunction.optional(),
  })
  .merge(baseUpdateVisualizationSchema)

export const chartVisualization = z
  .object({
    fieldId: fieldIdSchema.optional(),
    chartType: chartTypeSchema,
    chartAggregateFunction: chartAggregateFunction.optional(),
    type: z.literal('chart'),
  })
  .merge(baseVisualizationSchema)

export type IChartVisualizationSchema = z.infer<typeof chartVisualization>

export type IChartVisualization = IVisualization & {
  type: 'chart'
  chartType: z.infer<typeof chartTypeSchema>
  fieldId?: FieldId
  chartAggregateFunction?: IChartAggregateFunction
}

export class ChartVisualization extends VisualizationVO<IChartVisualization> {
  type: IVisualizationTypeSchema = 'chart'

  public get fieldId() {
    return this.props.fieldId
  }

  public get chartType() {
    return this.props.chartType
  }

  public get chartAggregateFunction() {
    return this.props.chartAggregateFunction
  }

  static create(input: z.infer<typeof createChartVisualizationSchema>) {
    return new ChartVisualization({
      ...super.create(input),
      type: 'chart',
      chartType: input.chartType,
      fieldId: input.fieldId ? FieldId.fromString(input.fieldId) : undefined,
      chartAggregateFunction: input.chartAggregateFunction,
    })
  }

  duplicate(): ChartVisualization {
    return new ChartVisualization({ ...this.props, id: VisualizationID.create() })
  }

  accept(v: IVisualizationVisitor): void {
    v.chart(this)
  }

  public removeField() {
    return new WithVisualizationFieldSpec(this.id.value, null)
  }

  public toJSON() {
    return {
      id: this.id.value,
      name: this.name.value,
      type: 'chart',
      fieldId: this.fieldId?.value,
      chartAggregateFunction: this.chartAggregateFunction,
      chartType: this.chartType,
    } as const
  }
}
