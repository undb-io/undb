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

const numberAggregateFunction = z.enum(['sum', 'average', 'min', 'max', 'count'])

export type INumberAggregateFunction = z.infer<typeof numberAggregateFunction>

export const numberAggregateFunctions: INumberAggregateFunction[] = ['sum', 'average', 'max', 'min', 'count']

export const createNumberVisualizationSchema = z
  .object({
    type: z.literal('number'),
    fieldId: fieldIdSchema.optional(),
    numberAggregateFunction: numberAggregateFunction.optional(),
  })
  .merge(baseCreateVisualizationSchema)

export const updateNumberVisualizationSchema = z
  .object({
    type: z.literal('number'),
    fieldId: fieldIdSchema.optional(),
    numberAggregateFunction: numberAggregateFunction.optional(),
  })
  .merge(baseUpdateVisualizationSchema)

export const numberVisualization = z
  .object({
    fieldId: fieldIdSchema.optional(),
    numberAggregateFunction: numberAggregateFunction.optional(),
    type: z.literal('number'),
  })
  .merge(baseVisualizationSchema)

export type INumberVisualizationSchema = z.infer<typeof numberVisualization>

export type INumberVisualization = IVisualization & {
  type: 'number'
  fieldId?: FieldId
  numberAggregateFunction?: INumberAggregateFunction
}

export class NumberVisualization extends VisualizationVO<INumberVisualization> {
  type: IVisualizationTypeSchema = 'number'

  public get fieldId() {
    return this.props.fieldId
  }

  public get numberAggregateFunction() {
    return this.props.numberAggregateFunction
  }

  static create(input: z.infer<typeof createNumberVisualizationSchema>) {
    return new NumberVisualization({
      ...super.create(input),
      type: 'number',
      fieldId: input.fieldId ? FieldId.fromString(input.fieldId) : undefined,
      numberAggregateFunction: input.numberAggregateFunction,
    })
  }

  duplicate(): NumberVisualization {
    return new NumberVisualization({ ...this.props, id: VisualizationID.create() })
  }

  accept(v: IVisualizationVisitor): void {
    v.number(this)
  }

  public removeField() {
    return new WithVisualizationFieldSpec(this.id.value, null)
  }

  public toJSON() {
    return {
      id: this.id.value,
      name: this.name.value,
      type: 'number',
      fieldId: this.fieldId?.value,
      numberAggregateFunction: this.numberAggregateFunction,
    } as const
  }
}
