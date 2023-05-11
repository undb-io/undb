import { z } from 'zod'
import { FieldId, fieldIdSchema } from '../field/index.js'
import {
  baseCreateVirsualizationSchema,
  baseUpdateVirsualizationSchema,
  virsualizationSchema,
} from './virsualization.schema.js'
import type { IVirsualization } from './virsualization.type.js'
import { type IVirsualizationTypeSchema } from './virsualization.type.js'
import type { IVirsualizationVisitor } from './virsualization.visitor.js'
import { VirsualizationVO } from './virsualization.vo.js'

const chartAggregateFunction = z.enum(['count'])

export type IChartAggregateFunction = z.infer<typeof chartAggregateFunction>

export const chartAggregateFunctions: IChartAggregateFunction[] = ['count']

export const createChartVirsualizationSchema = z
  .object({
    type: z.literal('chart'),
    fieldId: fieldIdSchema,
    chartAggregateFunction: chartAggregateFunction,
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
    fieldId: fieldIdSchema,
    chartAggregateFunction: chartAggregateFunction,
  })
  .merge(virsualizationSchema)

export type IChartVirsualizationSchema = z.infer<typeof chartVirsualization>

export type IChartVirsualization = IVirsualization & {
  fieldId: FieldId
  chartAggregateFunction: IChartAggregateFunction
}

export class ChartVirsualization extends VirsualizationVO<IChartVirsualization> {
  type: IVirsualizationTypeSchema = 'chart'

  public get fieldId() {
    return this.props.fieldId
  }

  public get chartAggregateFunction() {
    return this.props.chartAggregateFunction
  }

  static create(input: z.infer<typeof createChartVirsualizationSchema>) {
    return new ChartVirsualization({
      ...super.create(input),
      type: 'chart',
      fieldId: FieldId.fromString(input.fieldId),
      chartAggregateFunction: input.chartAggregateFunction,
    })
  }

  accept(v: IVirsualizationVisitor): void {
    v.chart(this)
  }
}
