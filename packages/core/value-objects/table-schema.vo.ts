import { ValueObject } from '@egodb/domain'
import { Option } from 'oxide.ts'
import * as z from 'zod'
import type { Field, ICreateFieldSchema } from '../field'
import { createFieldSchema, DateField, DateRangeField, fieldNameSchema, SelectField } from '../field'
import { FieldFactory } from '../field/field.factory'
import type { TableCompositeSpecificaiton } from '../specifications/interface'
import { WithNewField } from '../specifications/table-field.specification'
import type { IKanbanField } from '../view'
import type { ICalendarField } from '../view/calendar'
import { ViewFieldsOrder } from '../view/view-fields-order.vo'

function hasDuplicates(names: string[]): boolean {
  return names.length === new Set(names).size
}

const namesSchema = fieldNameSchema.array().refine(hasDuplicates)

export const createTableSchemaSchema = z
  .array(createFieldSchema)
  .min(1, { message: 'create table required at least one schema field' })
  .refine((inputs) => hasDuplicates(inputs.map((i) => i.name)), { message: 'field name should not duplicated' })

export type ICreateTableSchemaInput = z.infer<typeof createTableSchemaSchema>

export type TableSchemaMap = Map<string, Field>

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

  public toMap(): TableSchemaMap {
    return new Map(this.fields.map((f) => [f.name.value, f]))
  }

  public get fields(): Field[] {
    return this.props
  }

  public get kanbanFields(): IKanbanField[] {
    return this.fields.filter((f) => f instanceof SelectField || f instanceof DateField) as IKanbanField[]
  }

  public get calendarFields(): ICalendarField[] {
    return this.fields.filter((f) => f instanceof DateField || f instanceof DateRangeField) as ICalendarField[]
  }

  get fieldsNames(): string[] {
    return this.props.map((f) => f.name.value)
  }

  private validateNames(...newNames: string[]) {
    const names = [...this.fieldsNames, ...newNames]
    namesSchema.parse(names)
  }

  public getField(name: string): Option<Field> {
    return Option(this.fields.find((f) => f.name.value === name))
  }

  public getFieldById(id: string): Option<Field> {
    return Option(this.fields.find((f) => f.id.value === id))
  }

  public addField(field: Field) {
    this.props.push(field)
  }

  public get defaultFieldsOrder(): ViewFieldsOrder {
    const order = this.props.map((v) => v.name.value)
    return ViewFieldsOrder.fromArray(order)
  }

  public createField(input: ICreateFieldSchema): [Field, TableCompositeSpecificaiton] {
    // FIXME: check name
    const field = FieldFactory.create(input)

    this.validateNames(field.name.value)

    const spec = new WithNewField(field)
    return [field, spec]
  }
}
