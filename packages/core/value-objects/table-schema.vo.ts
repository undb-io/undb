import { ValueObject } from '@egodb/domain'
import { Option } from 'oxide.ts'
import * as z from 'zod'
import type { Field, ICreateFieldSchema } from '../field'
import { createFieldSchema } from '../field'
import { FieldFactory } from '../field/field.factory'

function hasDuplicates(elements: ICreateFieldSchema[]): boolean {
  const names = elements.map((e) => e.name)

  return names.length === new Set(names).size
}

export const createTableSchemaSchema = z
  .array(createFieldSchema)
  .min(1, { message: 'create table required at least one schema field' })
  .refine(hasDuplicates, { message: 'name should not duplicated' })

export type ICreateTableSchemaInput = z.infer<typeof createTableSchemaSchema>

/**
 * Table Schema is a collection of fields
 */
export class TableSchema extends ValueObject<Field[]> {
  static create(inputs: ICreateTableSchemaInput): TableSchema {
    const fields = createTableSchemaSchema.parse(inputs).map(FieldFactory.create)
    return new TableSchema(fields)
  }

  static unsafeCreate(inputs: ICreateTableSchemaInput): TableSchema {
    const fields = inputs.map(FieldFactory.unsafeCreate)
    return new TableSchema(fields)
  }

  public get fields(): Field[] {
    return this.props
  }

  public getField(name: string): Option<Field> {
    return Option(this.fields.find((f) => f.name.value === name))
  }
}
