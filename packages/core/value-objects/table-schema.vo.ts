import { ValueObject } from '@egodb/domain'
import * as z from 'zod'
import type { Field } from '../field'
import { createFieldSchema } from '../field'
import { FieldFactory } from '../field/field.factory'

export const createTableSchemaSchema = z
  .array(createFieldSchema)
  .min(1, { message: 'create table required at least one schema field' })

export type ICreateTableSchemaInput = z.infer<typeof createTableSchemaSchema>

/**
 * Table Schema is a collection of fields
 */
export class TableSchema extends ValueObject<Field[]> {
  constructor(props: Field[]) {
    super(props)
  }

  static create(inputs: ICreateTableSchemaInput): TableSchema {
    const fields = inputs.map(FieldFactory.create)
    return new TableSchema(fields)
  }

  static unsafeCreate(inputs: ICreateTableSchemaInput): TableSchema {
    const fields = inputs.map(FieldFactory.unsafeCreate)
    return new TableSchema(fields)
  }

  public get fields(): Field[] {
    return this.props
  }
}
