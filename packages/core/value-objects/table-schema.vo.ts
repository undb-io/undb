import { ValueObject } from '@egodb/domain'
import { Option } from 'oxide.ts'
import type { Class } from 'type-fest'
import * as z from 'zod'
import type { Field, ICreateFieldSchema } from '../field'
import { createFieldSchema, DateField, DateRangeField, SelectField, WithoutField } from '../field'
import { FieldFactory } from '../field/field.factory'
import { fieldKeySchema } from '../field/value-objects/field-key.schema'
import { fieldNameSchema } from '../field/value-objects/field-name.schema'
import { WithNewField } from '../specifications/table-field.specification'
import type { IKanbanField } from '../view'
import type { ICalendarField } from '../view/calendar'
import { ViewFieldsOrder } from '../view/view-fields-order.vo'

function hasDuplicates(names: string[]): boolean {
  return names.length === new Set(names).size
}

const namesSchema = fieldNameSchema
  .array()
  .refine(hasDuplicates, { message: 'field name should not be duplicated', path: ['field', 'name'] })
const idsSchema = fieldKeySchema
  .array()
  .refine(hasDuplicates, { message: 'field id should not be duplicated', path: ['field', 'id'] })

export const createTableSchemaSchema = z
  .array(createFieldSchema)
  .min(1, { message: 'create table required at least one schema field' })
  .refine((inputs) => hasDuplicates(inputs.map((i) => i.name)), { message: 'field name should not duplicated' })

export type ICreateTableSchemaInput = z.infer<typeof createTableSchemaSchema>

export type TableSchemaIdMap = Map<string, Field>

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

  public toIdMap(): TableSchemaIdMap {
    return new Map(this.fields.map((f) => [f.id.value, f]))
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

  get fieldsKeys(): string[] {
    return this.props.map((f) => f.id.value)
  }

  get fieldsIds(): string[] {
    return this.props.map((f) => f.id.value)
  }

  private validateNames(...newNames: string[]) {
    const names = [...this.fieldsNames, ...newNames]
    namesSchema.parse(names)
  }

  private validateKeys(...newKeys: string[]) {
    const ids = [...this.fieldsKeys, ...newKeys]
    idsSchema.parse(ids)
  }

  public getFieldById(id: string): Option<Field> {
    return Option(this.fields.find((f) => f.id.value === id))
  }

  public getFieldByIdOfType<F extends Field>(id: string, type: Class<F>): Option<F> {
    return Option(this.fields.find((f) => f.id.value === id && f instanceof type) as F)
  }

  public addField(field: Field) {
    this.props.push(field)
  }

  public get defaultFieldsOrder(): ViewFieldsOrder {
    const order = this.props.map((v) => v.id.value)
    return ViewFieldsOrder.fromArray(order)
  }

  public createField(input: ICreateFieldSchema): WithNewField {
    const field = FieldFactory.create(input)

    this.validateNames(field.name.value)
    this.validateKeys(field.key.value)

    return new WithNewField(field)
  }

  public removeField(id: string): WithoutField {
    const field = this.getFieldById(id).unwrap()

    return new WithoutField(field)
  }
}
