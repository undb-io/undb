import { ValueObject } from '@egodb/domain'
import { Option } from 'oxide.ts'
import type { Class } from 'type-fest'
import * as z from 'zod'
import type { Field, ICreateFieldSchema, NoneSystemField } from '../field'
import {
  createFieldSchema,
  DateField,
  DateRangeField,
  ReferenceField,
  SelectField,
  TreeField,
  WithoutField,
} from '../field'
import { CreatedAtField } from '../field/created-at-field'
import { FieldFactory } from '../field/field.factory'
import { IdField } from '../field/id-field'
import { UpdatedAtField } from '../field/updated-at-field'
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
    const fields = createTableSchemaSchema
      .parse(inputs)
      .map(FieldFactory.create)
      .flatMap((f) => (f instanceof TreeField ? ([f, f.createParentField()] as [Field, Field]) : f))

    return new TableSchema([IdField.default(), ...fields, CreatedAtField.default(), UpdatedAtField.default()])
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

  public get nonSystemFields(): NoneSystemField[] {
    return this.fields.filter((f) => !f.isSystem()) as NoneSystemField[]
  }

  public get referenceFields(): ReferenceField[] {
    return this.fields.filter((f) => f instanceof ReferenceField) as ReferenceField[]
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

  get fieldsIds(): string[] {
    return this.props.map((f) => f.id.value)
  }

  private validateNames(...newNames: string[]) {
    const names = [...this.fieldsNames, ...newNames]
    namesSchema.parse(names)
  }

  public getFieldById(id: string): Option<Field> {
    return Option(this.fields.find((f) => f.id.value === id))
  }

  public getFieldByIdOfType<F extends Field>(id: string, type: Class<F>): Option<F> {
    return Option(this.fields.find((f) => f.id.value === id && f instanceof type) as F)
  }

  public addField(field: Field) {
    this.fields.push(field)
  }

  public get defaultFieldsOrder(): ViewFieldsOrder {
    const order = this.props.map((v) => v.id.value)
    return ViewFieldsOrder.fromArray(order)
  }

  public createField(input: ICreateFieldSchema): WithNewField[] {
    const field = FieldFactory.create(input)
    const specs = [new WithNewField(field)]
    if (field.type === 'tree') {
      specs.push(new WithNewField(field.createParentField()))
    }

    this.validateNames(...specs.map((spec) => spec.field.name.value))

    return specs
  }

  public removeField(id: string): WithoutField {
    const field = this.getFieldById(id).unwrap()

    if (field.isSystem()) {
      throw new Error('not allowed to delete system field')
    }

    return new WithoutField(field)
  }
}
