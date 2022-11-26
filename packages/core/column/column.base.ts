import { Entity } from '@egodb/domain'
import * as z from 'zod'
import { columnIdSchema, columnNameSchema, valueConstraintsSchema } from './value-objects'
import { ColumnId } from './value-objects/column-id.vo'

export const baseColumnSchema = z
  .object({
    name: columnNameSchema,
  })
  .merge(valueConstraintsSchema)

export type BaseColumnProps = z.infer<typeof baseColumnSchema>

export const createBaseColumnsSchema = baseColumnSchema.merge(z.object({ id: columnIdSchema.optional() }))

export type BaseCreateColumnsSchema = z.infer<typeof createBaseColumnsSchema>

export abstract class BaseColumn<CP extends BaseColumnProps = BaseColumnProps> extends Entity<ColumnId, CP> {
  constructor(props: CP, id = new ColumnId()) {
    super({ id, props })
  }

  public get name(): string {
    return this.props.name
  }
}
