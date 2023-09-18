import { ValueObject } from '@undb/domain'
import { castArray } from 'lodash-es'
import { Option } from 'oxide.ts'
import type { Class } from 'type-fest'
import * as z from 'zod'
import type { ClsStore } from '../../cls/cls.js'
import { FieldFactory } from '../field/field.factory.js'
import { CreatedAtField } from '../field/fields/created-at/created-at-field.js'
import { IdField } from '../field/fields/id/id-field.js'
import { UpdatedAtField } from '../field/fields/updated-at/updated-at-field.js'
import type {
  AggregateFieldType,
  Field,
  IBaseSchemaEventSchema,
  ICreateFieldSchema,
  IFieldType,
  LookingFieldTypes,
  NoneSystemField,
} from '../field/index.js'
import {
  AttachmentField,
  CreatedByField,
  DateField,
  DateRangeField,
  ReferenceField,
  SelectField,
  TreeField,
  UpdatedByField,
  WithoutField,
  createFieldSchema,
  getNamesWithInternals,
  getNextFieldName,
  isSearchable,
} from '../field/index.js'
import { fieldNameSchema } from '../field/value-objects/field-name.schema.js'
import type { Records } from '../record/record.type.js'
import { WithNewField } from '../specifications/table-field.specification.js'
import type { ICalendarField } from '../view/calendar/index.js'
import type { IGalleryField, IGanttField, IKanbanField, ITreeViewField } from '../view/index.js'
import { ViewFieldsOrder } from '../view/view-fields-order.vo.js'

function hasDuplicates(names: string[]): boolean {
  return names.length === new Set(names).size
}

const namesSchema = fieldNameSchema
  .array()
  .refine(hasDuplicates, { message: 'field name should not be duplicated', path: ['field', 'name'] })

export const createTableSchemaSchema = z
  .array(createFieldSchema)
  // .min(1, { message: 'create table required at least one schema field' })
  .refine((inputs) => hasDuplicates(inputs.map((i) => i.name)), { message: 'field name should not duplicated' })
  .default([])

export const updateTableSchemaSchema = createTableSchemaSchema
export type IUpdateTableSchemaSchema = z.infer<typeof updateTableSchemaSchema>

export type ICreateTableSchemaInput = z.infer<typeof createTableSchemaSchema>

export type TableSchemaIdMap = Map<string, Field>
export type TableSchemaNameMap = Map<string, Field>

const lookingFieldTypes: IFieldType[] = ['tree', 'parent', 'reference', 'lookup']
const aggregateFieldTypes: IFieldType[] = ['count', 'sum', 'average']

/**
 * Table Schema is a collection of fields
 */
export class TableSchema extends ValueObject<Field[]> {
  static create(inputs: ICreateTableSchemaInput, ctx: ClsStore): TableSchema {
    const fields = createTableSchemaSchema.parse(inputs).flatMap(FieldFactory.create)

    const names = getNamesWithInternals(
      inputs.map((n) => n.name),
      ctx.t,
      ctx.lang,
    )
    namesSchema.parse(names)

    return new TableSchema([
      IdField.default(),
      ...fields,
      CreatedAtField.default(ctx.t('created-at', { lng: ctx.lang })),
      CreatedByField.default(ctx.t('created-by', { lng: ctx.lang })),
      UpdatedAtField.default(ctx.t('updated-at', { lng: ctx.lang })),
      UpdatedByField.default(ctx.t('updated-by', { lng: ctx.lang })),
    ])
  }

  public toEvent(records: Records): IBaseSchemaEventSchema {
    return this.fields.map((f) => f.toEvent(records))
  }

  static unsafeCreate(inputs: ICreateTableSchemaInput): TableSchema {
    const fields = inputs.map(FieldFactory.unsafeCreate)
    return new TableSchema(fields)
  }

  public toIdMap(): TableSchemaIdMap {
    return new Map(this.fields.map((f) => [f.id.value, f]))
  }

  public toNameMap(): TableSchemaNameMap {
    return new Map(this.fields.map((f) => [f.name.value, f]))
  }

  public get fields(): Field[] {
    return this.props
  }

  public get nonSystemFields(): NoneSystemField[] {
    return this.fields.filter((f) => !f.isSystem()) as NoneSystemField[]
  }

  public get nonControlledFields() {
    return this.fields.filter((f) => !f.controlled)
  }

  public get referenceFields(): ReferenceField[] {
    return this.fields.filter((f) => f instanceof ReferenceField) as ReferenceField[]
  }

  public get kanbanFields(): IKanbanField[] {
    return this.fields.filter((f) => f instanceof SelectField || f instanceof DateField) as IKanbanField[]
  }

  public get galleryFields(): IGalleryField[] {
    return this.fields.filter((f) => f instanceof AttachmentField) as IGalleryField[]
  }

  public get ganttFields(): IGanttField[] {
    return this.fields.filter((f) => f instanceof DateRangeField) as IGanttField[]
  }

  public get searchableFields(): Field[] {
    return this.fields.filter((f) => isSearchable(f.type))
  }

  public get calendarFields(): ICalendarField[] {
    return this.fields.filter((f) => f instanceof DateField || f instanceof DateRangeField) as ICalendarField[]
  }

  public get treeFields(): ITreeViewField[] {
    return this.fields.filter((f) => f instanceof TreeField) as ITreeViewField[]
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

  public getFieldByName(name: string): Option<Field> {
    return Option(this.fields.find((f) => f.name.value === name))
  }

  public getFieldByIdOfType<F extends Field>(id: string, type: Class<F>): Option<F> {
    return Option(this.fields.find((f) => f.id.value === id && f instanceof type) as F)
  }

  public addField(field: Field) {
    this.fields.push(field)
  }

  public get displayFields() {
    return this.fields.filter((f) => f.display)
  }

  public get defaultFieldsOrder(): ViewFieldsOrder {
    const order = this.props.map((v) => v.id.value)
    return ViewFieldsOrder.fromArray(order)
  }

  public createField(input: ICreateFieldSchema): WithNewField[] {
    const fields = FieldFactory.create(input)
    const specs = castArray(fields).map((field) => new WithNewField(field))

    this.validateNames(...specs.map((spec) => spec.field.name.value))

    return specs
  }

  public removeField(id: string): WithoutField {
    const field = this.getFieldById(id).unwrap()

    if (field.isSystem()) {
      throw new Error('not allowed to delete system field')
    }

    return new WithoutField(field.type, field.id.value)
  }

  public get lookingFields(): LookingFieldTypes[] {
    return this.fields.filter((f) => lookingFieldTypes.includes(f.type)) as LookingFieldTypes[]
  }

  public get aggregateFields(): AggregateFieldType[] {
    return this.fields.filter((f) => aggregateFieldTypes.includes(f.type)) as AggregateFieldType[]
  }

  public getNextFieldName(fieldName?: string): string {
    return getNextFieldName(this.fieldsNames, fieldName)
  }
}
