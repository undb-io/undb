import { ValueObject } from '@egodb/domain'
import * as z from 'zod'
import type { IFilter, IOperator } from '../filter'
import type { IBaseField, IFieldType } from './field.type'
import type { FieldName } from './value-objects'
import { valueConstraintsSchema } from './value-objects'
import { fieldIdSchema } from './value-objects/field-id.schema'
import type { FieldId } from './value-objects/field-id.vo'
import { fieldNameSchema } from './value-objects/field-name.schema'

export const createBaseFieldsSchema = z
  .object({
    id: fieldIdSchema,
    name: fieldNameSchema,
  })
  .merge(valueConstraintsSchema)

export type IBaseCreateFieldsSchema = z.infer<typeof createBaseFieldsSchema>

export const baseFieldQuerySchema = z.object({ id: fieldIdSchema, name: fieldNameSchema }).merge(valueConstraintsSchema)

export abstract class BaseField<C extends IBaseField> extends ValueObject<C> {
  abstract type: IFieldType
  public get id(): FieldId {
    return this.props.id
  }
  public get name(): FieldName {
    return this.props.name
  }

  public get required(): boolean {
    return this.props.valueConstrains.required
  }

  abstract createFilter(operator: IOperator, value: unknown): IFilter
}
