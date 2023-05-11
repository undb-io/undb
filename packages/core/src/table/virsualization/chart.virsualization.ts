import { z } from 'zod'
import { FieldId, fieldIdSchema } from '../field/index.js'
import {
  baseCreateVirsualizationSchema,
  baseUpdateVirsualizationSchema,
  baseVirsualizationSchema,
} from './virsualization.schema.js'
import type { IVirsualization } from './virsualization.type.js'
import { type IVirsualizationTypeSchema } from './virsualization.type.js'
import type { IVirsualizationVisitor } from './virsualization.visitor.js'
import { VirsualizationVO } from './virsualization.vo.js'

export const chartTypeSchema = z.enum(['bar'])
export type IChartType = z.infer<typeof chartTypeSchema>

export const chartAggregateFunction = z.enum(['count'])

export type IChartAggregateFunction = z.infer<typeof chartAggregateFunction>

export const chartAggregateFunctions: IChartAggregateFunction[] = ['count']

export const createChartVirsualizationSchema = z
  .object({
    type: z.literal('chart'),
    chartType: chartTypeSchema,
    fieldId: fieldIdSchema.optional(),
    chartAggregateFunction: chartAggregateFunction.optional(),
  })
  .merge(baseCreateVirsualizationSchema)

export const updateChartVirsualizationSchema = z
  .object({
    type: z.literal('chart'),
    fieldId: fieldIdSchema.optional(),
    chartAggregateFunction: chartAggregateFunction.optional(),
  })
  .merge(baseUpdateVirsualizationSchema)

export const chartVirsualization = z
  .object({
    fieldId: fieldIdSchema.optional(),
    chartType: chartTypeSchema,
    chartAggregateFunction: chartAggregateFunction.optional(),
    type: z.literal('chart'),
  })
  .merge(baseVirsualizationSchema)

export type IChartVirsualizationSchema = z.infer<typeof chartVirsualization>

export type IChartVirsualization = IVirsualization & {
  charType: z.infer<typeof chartTypeSchema>
  fieldId?: FieldId
  chartAggregateFunction?: IChartAggregateFunction
}

export class ChartVirsualization extends VirsualizationVO<IChartVirsualization> {
  type: IVirsualizationTypeSchema = 'chart'

  public get fieldId() {
    return this.props.fieldId
  }

  public get chartType() {
    return this.props.charType
  }

  public get chartAggregateFunction() {
    return this.props.chartAggregateFunction
  }

  static create(input: z.infer<typeof createChartVirsualizationSchema>) {
    return new ChartVirsualization({
      ...super.create(input),
      type: 'chart',
      charType: input.chartType,
      fieldId: input.fieldId ? FieldId.fromString(input.fieldId) : undefined,
      chartAggregateFunction: input.chartAggregateFunction,
    })
  }

  accept(v: IVirsualizationVisitor): void {
    v.chart(this)
  }
}
