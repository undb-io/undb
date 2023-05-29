import { and, ValueObject } from '@undb/domain'
import { isArray, isBoolean, isEmpty, isNull, isString, unzip } from 'lodash-es'
import fp from 'lodash/fp.js'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import type { ZodType } from 'zod'
import type { IFilter, IOperator } from '../filter/index.js'
import { OptionKey } from '../option/option-key.vo.js'
import type { ICreateOptionSchema, IMutateOptionSchema, IUpdateOptionSchema } from '../option/option.schema.js'
import type { Options } from '../option/options.js'
import type { IRecordDisplayValues, Record, RecordValueJSON } from '../record/index.js'
import type { TableCompositeSpecificaiton } from '../specifications/interface.js'
import type { TableSchema, TableSchemaIdMap } from '../value-objects/table-schema.vo.js'
import type { IBaseCreateFieldSchema, IBaseUpdateFieldSchema } from './field-base.schema.js'
import { DEFAULT_DATE_FORMAT } from './field.constants.js'
import type {
  Field,
  IAbstractAggregateField,
  IAbstractDateField,
  IAbstractLookingField,
  IAbstractLookupField,
  IAbstractReferenceField,
  IAbstractSelectField,
  IBaseField,
  IBaseFieldQueryScheam,
  IDateFieldType,
  IDateFieldTypes,
  IFieldType,
  ILookingFieldIssues,
  ILookingFieldType,
  ILookingFieldTypes,
  ILookupFieldTypes,
  INumberAggregateFieldType,
  IReferenceFieldTypes,
  ISelectFieldType,
  IUpdateFieldSchema,
  LookingFieldIssue,
  PrimitiveField,
  SystemField,
} from './field.type.js'
import { canDisplay, isAggregate, isControlledFieldType, isFilterable, isNumeric, isSortable } from './field.util.js'
import type { IFieldVisitor } from './field.visitor.js'
import type { ReferenceField } from './reference-field.js'
import { WithAggregateFieldId } from './specifications/aggregate-field.specification.js'
import { WithFieldDescription, WithFieldDisplay, WithFieldName } from './specifications/base-field.specification.js'
import { WithFormat, WithTimeFormat } from './specifications/date-field.specification.js'
import { WithFieldRequirement } from './specifications/field-constraints.specification.js'
import { WithReferenceFieldId } from './specifications/lookup-field.specification.js'
import { WithDisplayFields } from './specifications/reference-field.specification.js'
import { WithNewOption, WithOption, WithOptions, WithoutOption } from './specifications/select-field.specification.js'
import type { TreeField } from './tree-field.js'
import { FieldDescription } from './value-objects/field-description.js'
import type { DateFormat, TimeFormat } from './value-objects/index.js'
import { DisplayFields, FieldId, FieldIssue, FieldName, FieldValueConstraints } from './value-objects/index.js'

const { map, pipe } = fp

export abstract class BaseField<C extends IBaseField = IBaseField> extends ValueObject<C> {
  public static createBase(input: IBaseCreateFieldSchema): IBaseField {
    const fieldName = FieldName.create(input.name)

    return {
      id: FieldId.fromNullableString(input.id),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
      description: input.description ? new FieldDescription({ value: input.description }) : undefined,
      display: input.display,
    }
  }

  public get json(): IBaseFieldQueryScheam {
    return {
      id: this.id.value,
      type: this.type,
      name: this.name.value,
      required: !!this.required,
      description: this.description?.value,
      display: !!this.display,
    }
  }

  public static unsafeCreateBase(input: IBaseCreateFieldSchema): IBaseField {
    return {
      id: FieldId.fromNullableString(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
      description: input.description ? new FieldDescription({ value: input.description }) : undefined,
      display: input.display,
    }
  }

  abstract type: IFieldType

  abstract getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): string | number | null

  get controlled(): boolean {
    return isControlledFieldType(this.type)
  }
  get system(): boolean {
    return false
  }
  get primitive(): boolean {
    return false
  }
  get filterable(): boolean {
    return isFilterable(this.type)
  }

  get valueConstrains() {
    return this.props.valueConstrains
  }

  get isNumeric(): boolean {
    return isNumeric(this.type)
  }

  get sortable(): boolean {
    return isSortable(this.type)
  }

  abstract duplicate(name: string): Field

  get display(): boolean {
    return this.props.display ?? false
  }

  set display(display: boolean) {
    this.props.display = display
  }

  isSystem(): this is SystemField {
    return this.system
  }

  isPrimitive(): this is PrimitiveField {
    return this.primitive
  }

  get isAggregate(): boolean {
    return isAggregate(this.type)
  }

  public get id(): FieldId {
    return this.props.id
  }

  public get name(): FieldName {
    return this.props.name
  }

  public set name(name: FieldName) {
    this.props.name = name
  }

  public get description(): FieldDescription | undefined {
    return this.props.description
  }

  public set description(description: FieldDescription | undefined) {
    this.props.description = description
  }

  public get required(): boolean {
    return this.props.valueConstrains.required
  }

  public set required(required: boolean) {
    this.props.valueConstrains = this.props.valueConstrains.setRequired(required)
  }

  abstract get valueSchema(): ZodType

  abstract createFilter(operator: IOperator, value: unknown): IFilter

  abstract accept(visitor: IFieldVisitor): void

  public get issues(): FieldIssue<string>[] {
    return []
  }

  public get hasIssue() {
    return !!this.issues.length
  }

  public update(input: IUpdateFieldSchema): Option<TableCompositeSpecificaiton> {
    return this.updateBase(input)
  }

  protected updateBase<T extends IBaseUpdateFieldSchema>(input: T): Option<TableCompositeSpecificaiton> {
    const specs: TableCompositeSpecificaiton[] = []
    if (isString(input.name)) {
      const spec = WithFieldName.fromString(this.type, this.id.value, input.name)
      specs.push(spec)
    }
    if (isString(input.description)) {
      const spec = WithFieldDescription.fromString(this.type, this.id.value, input.description)
      specs.push(spec)
    }
    if (isBoolean(input.required) && !this.controlled) {
      specs.push(new WithFieldRequirement(this.type, this.id.value, input.required))
    }
    if (isBoolean(input.display) && canDisplay(this.type)) {
      specs.push(new WithFieldDisplay(this.type, this.id.value, input.display))
    }
    return and(...specs)
  }
}

export abstract class AbstractReferenceField<F extends IReferenceFieldTypes = IReferenceFieldTypes>
  extends BaseField<F>
  implements IAbstractReferenceField
{
  get foreignTableId(): Option<string> {
    return None
  }
}

export abstract class AbstractDateField<F extends IDateFieldTypes = IDateFieldTypes>
  extends BaseField<F>
  implements IAbstractDateField
{
  abstract type: IDateFieldType
  get formatString(): string {
    return this.props.format?.unpack() ?? DEFAULT_DATE_FORMAT
  }

  set format(format: DateFormat | undefined) {
    this.props.format = format
  }

  get format(): DateFormat | undefined {
    return this.props.format
  }

  updateFormat(format?: string | undefined): Option<TableCompositeSpecificaiton> {
    if (isString(format)) {
      return Some(WithFormat.fromString(this.type, this.id.value, format))
    }

    return None
  }

  get timeFormatString(): string | null {
    return this.props.timeFormat?.unpack() ?? null
  }

  set timeFormat(format: TimeFormat | undefined) {
    this.props.timeFormat = format
  }

  get timeFormat(): TimeFormat | undefined {
    return this.props.timeFormat
  }

  updateTimeFormat(format?: string | undefined | null): Option<TableCompositeSpecificaiton> {
    if (isString(format) || isNull(format)) {
      return Some(WithTimeFormat.from(this.type, this.id.value, format))
    }

    return None
  }
}

export abstract class AbstractLookingField<F extends ILookingFieldTypes>
  extends BaseField<F>
  implements IAbstractLookingField
{
  abstract type: ILookingFieldType
  abstract get multiple(): boolean

  get displayFieldIds(): FieldId[] {
    return this.props.displayFields?.ids ?? []
  }

  set displayFieldIds(ids: FieldId[]) {
    this.props.displayFields = new DisplayFields(ids)
  }

  getDisplayFieldIds(schema: TableSchema) {
    let displayFields = this.props.displayFields?.ids.filter(Boolean) ?? []
    if (!displayFields.length) {
      displayFields = schema.displayFields.map((f) => f.id)
    }

    return displayFields as FieldId[]
  }

  getForeignDisplayValues(foreignRecord: Record, foreignSchema: TableSchema) {
    const displayFieldIds = this.getDisplayFieldIds(foreignSchema)
    if (!displayFieldIds.length) {
      return undefined
    }

    const json = foreignRecord.valuesJSON
    return displayFieldIds.map((f) => json[f.value])
  }

  getDisplayValues(values?: IRecordDisplayValues): (string | null)[][] {
    if (isEmpty(this.displayFieldIds)) {
      return pipe(
        map((id: string) => values?.[this.id.value]?.[id] ?? []),
        unzip,
      )(['id'])
    }

    return pipe(
      map((displayFieldId: FieldId) => values?.[this.id.value]?.[displayFieldId.value] ?? []),
      unzip,
    )(this.displayFieldIds)
  }

  updateDisplayFieldIds(displayFieldIds?: string[]): Option<TableCompositeSpecificaiton> {
    if (isArray(displayFieldIds)) {
      return Some(WithDisplayFields.fromIds(this.type, this.id.value, displayFieldIds))
    }
    return None
  }
}

export abstract class AbstractLookupField<F extends ILookupFieldTypes>
  extends BaseField<F>
  implements IAbstractLookupField
{
  get referenceFieldId(): FieldId {
    return this.props.referenceFieldId
  }

  set referenceFieldId(fieldId: FieldId) {
    this.props.referenceFieldId = fieldId
  }

  getIssues(schema: TableSchemaIdMap): LookingFieldIssue[] {
    const issues: LookingFieldIssue[] = []

    if (!this.getReferenceField(schema)) {
      issues.push(new FieldIssue<ILookingFieldIssues>({ value: 'Missing Reference Field' }))
    }

    return issues
  }

  getReferenceField(schema: TableSchemaIdMap): ReferenceField | TreeField | undefined {
    const referenceField = schema.get(this.referenceFieldId.value)
    return referenceField as ReferenceField | TreeField | undefined
  }

  mustGetReferenceField(schema: TableSchemaIdMap): ReferenceField | TreeField {
    const referenceField = schema.get(this.referenceFieldId.value)
    if (!referenceField) {
      throw new Error('missing reference field for lookup field')
    }

    return referenceField as ReferenceField | TreeField
  }

  getForeignTableId(schema: TableSchemaIdMap): Option<string> {
    return this.mustGetReferenceField(schema).foreignTableId
  }

  updateReferenceId(referenceId?: string): Option<TableCompositeSpecificaiton> {
    if (isString(referenceId)) {
      return Some(WithReferenceFieldId.fromString(this, referenceId))
    }

    return None
  }
}

export abstract class AbstractAggregateField<F extends INumberAggregateFieldType>
  extends BaseField<F>
  implements IAbstractAggregateField
{
  get aggregateFieldId(): FieldId {
    return this.props.aggregateFieldId
  }

  set referenceFieldId(fieldId: FieldId) {
    this.props.aggregateFieldId = fieldId
  }

  updateAggregateFieldId(aggregateFieldId?: string): Option<TableCompositeSpecificaiton> {
    if (isString(aggregateFieldId)) {
      return Some(WithAggregateFieldId.fromString(this, aggregateFieldId))
    }

    return None
  }
}

export abstract class AbstractSelectField<F extends ISelectFieldType>
  extends BaseField<F>
  implements IAbstractSelectField
{
  get options(): Options {
    return this.props.options
  }

  set options(options: Options) {
    this.props.options = options
  }

  reorder(from: string, to: string): WithOptions {
    const options = this.options.reorder(from, to)
    return new WithOptions(this, options)
  }
  createOption(input: ICreateOptionSchema): WithNewOption {
    const option = this.options.createOption(input)
    return new WithNewOption(this, option)
  }
  updateOption(id: string, input: IUpdateOptionSchema): WithOption {
    const option = this.options.getById(id).unwrap()

    return new WithOption(this, option.updateOption(input))
  }
  removeOption(id: string): WithoutOption {
    const optionKey = OptionKey.fromString(id)
    return new WithoutOption(this, optionKey)
  }
  updateOptions(input: IMutateOptionSchema[]): Option<TableCompositeSpecificaiton> {
    if (!input.length) {
      return None
    }

    const specs: TableCompositeSpecificaiton[] = []
    const options = this.options.optionsMap
    for (const option of input) {
      const existing = !!option.key && !!options.get(option.key)
      if (existing) {
        specs.push(this.updateOption(option.key!, option))
        continue
      }

      specs.push(this.createOption(option))
    }
    for (const [id] of options) {
      if (!input.some((o) => o.key === id)) {
        specs.push(this.removeOption(id))
      }
    }

    return and(...specs)
  }
}
