import { and, ValueObject } from '@egodb/domain'
import { isArray, isBoolean, isEmpty, isString, unzip } from 'lodash-es'
import fp from 'lodash/fp.js'
import type { Option } from 'oxide.ts'
import { None } from 'oxide.ts'
import type { ZodTypeAny } from 'zod'
import type { IFilter, IOperator } from '../filter/index.js'
import type { IRecordDisplayValues } from '../record/index.js'
import type { TableCompositeSpecificaiton } from '../specifications/interface.js'
import type { ICreateCreatedAtFieldInput, IUpdateCreatedAtFieldInput } from './created-at-field.type.js'
import type { ICreateDateFieldSchema, IUpdateDateFieldInput } from './date-field.type.js'
import type { ICreateDateRangeFieldSchema, IUpdateDateRangeFieldInput } from './date-range-field.type.js'
import type { IBaseCreateFieldSchema, IBaseUpdateFieldSchema } from './field-base.schema.js'
import { DEFAULT_DATE_FORMAT } from './field.constants.js'
import type {
  IAbstractDateField,
  IBaseField,
  IDateFieldTypes,
  IFieldType,
  IReference,
  IReferenceFieldTypes,
  IUpdateFieldSchema,
  PrimitiveField,
  SystemField,
} from './field.type.js'
import { isControlledFieldType } from './field.util.js'
import type { IFieldVisitor } from './field.visitor.js'
import type { ICreateParentFieldInput, IUpdateParentFieldInput } from './parent-field.type.js'
import type { ICreateReferenceFieldInput, IUpdateReferenceFieldInput } from './reference-field.type.js'
import { WithFieldDescription, WithFieldName } from './specifications/base-field.specification.js'
import { WithFormat } from './specifications/date-field.specification.js'
import { WithFieldRequirement } from './specifications/field-constraints.specification.js'
import { WithDisplayFields } from './specifications/reference-field.specification.js'
import type { ICreateTreeFieldSchema, IUpdateTreeFieldInput } from './tree-field.type.js'
import type { ICreateUpdatedAtFieldInput, IUpdateUpdatedAtFieldInput } from './updated-at-field.type.js'
import { FieldDescription } from './value-objects/field-description.js'
import { DateFormat, DisplayFields, FieldId, FieldName, FieldValueConstraints } from './value-objects/index.js'

const { map, pipe } = fp

export abstract class BaseField<C extends IBaseField = IBaseField> extends ValueObject<C> {
  protected static createBase(input: IBaseCreateFieldSchema): IBaseField {
    const fieldName = FieldName.create(input.name)

    return {
      id: FieldId.fromNullableString(input.id),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
      description: input.description ? new FieldDescription({ value: input.description }) : undefined,
    }
  }

  protected static unsafeCreateBase(input: IBaseCreateFieldSchema): IBaseField {
    return {
      id: FieldId.fromNullableString(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
      description: input.description ? new FieldDescription({ value: input.description }) : undefined,
    }
  }

  abstract type: IFieldType
  get controlled(): boolean {
    return isControlledFieldType(this.type)
  }
  get system(): boolean {
    return false
  }
  get primitive(): boolean {
    return false
  }

  isSystem(): this is SystemField {
    return this.system
  }

  isPrimitive(): this is PrimitiveField {
    return this.primitive
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

  abstract get valueSchema(): ZodTypeAny

  abstract createFilter(operator: IOperator, value: unknown): IFilter

  abstract accept(visitor: IFieldVisitor): void

  public update(input: IUpdateFieldSchema): Option<TableCompositeSpecificaiton> {
    return this.updateBase(input)
  }

  protected updateBase<T extends IBaseUpdateFieldSchema>(input: T): Option<TableCompositeSpecificaiton> {
    const specs: TableCompositeSpecificaiton[] = []
    if (isString(input.name)) {
      const spec = WithFieldName.fromString(this, input.name)
      specs.push(spec)
    }
    if (isString(input.description)) {
      const spec = WithFieldDescription.fromString(this, input.description)
      specs.push(spec)
    }
    if (isBoolean(input.required) && !this.controlled) {
      specs.push(new WithFieldRequirement(this, input.required))
    }
    return and(...specs)
  }
}

type ICreateReferenceBaseSchema = Omit<
  ICreateTreeFieldSchema | ICreateReferenceFieldInput | ICreateParentFieldInput,
  'type'
>

export abstract class BaseReferenceField<F extends IReferenceFieldTypes> extends BaseField<F> implements IReference {
  protected static override createBase(input: ICreateReferenceBaseSchema): IReferenceFieldTypes {
    return {
      ...super.createBase(input),
      displayFields: input.displayFieldIds
        ? new DisplayFields(input.displayFieldIds.map((id) => FieldId.fromString(id)))
        : undefined,
    }
  }
  protected static override unsafeCreateBase(input: ICreateReferenceBaseSchema): IReferenceFieldTypes {
    return {
      ...super.createBase(input),
      displayFields: input.displayFieldIds
        ? new DisplayFields(input.displayFieldIds.map((id) => FieldId.fromString(id)))
        : undefined,
    }
  }
  get foreignTableId(): Option<string> {
    return None
  }

  get displayFieldIds(): FieldId[] {
    return this.props.displayFields?.ids ?? []
  }

  set displayFieldIds(ids: FieldId[]) {
    this.props.displayFields = new DisplayFields(ids)
  }

  public override update(
    input: IUpdateTreeFieldInput | IUpdateParentFieldInput | IUpdateReferenceFieldInput,
  ): Option<TableCompositeSpecificaiton> {
    return this.updateReference(input)
  }

  protected updateReference<T extends IUpdateTreeFieldInput | IUpdateParentFieldInput | IUpdateReferenceFieldInput>(
    input: T,
  ): Option<TableCompositeSpecificaiton> {
    const specs: TableCompositeSpecificaiton[] = []
    const spec = super.updateBase(input)
    if (spec.isSome()) {
      specs.push(spec.unwrap())
    }

    if (isArray(input.displayFieldIds)) {
      specs.push(WithDisplayFields.fromIds(this, input.displayFieldIds))
    }

    return and(...specs)
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
}

type ICreateDateTypeBaseSchema = Omit<
  ICreateDateFieldSchema | ICreateCreatedAtFieldInput | ICreateUpdatedAtFieldInput | ICreateDateRangeFieldSchema,
  'type'
>

export abstract class BaseDateField<F extends IDateFieldTypes> extends BaseField<F> implements IAbstractDateField {
  protected static override createBase(input: ICreateDateTypeBaseSchema): IDateFieldTypes {
    return {
      ...super.createBase(input),
      format: input.format ? DateFormat.fromString(input.format) : undefined,
    }
  }

  protected static override unsafeCreateBase(input: ICreateDateTypeBaseSchema): IDateFieldTypes {
    return {
      ...super.unsafeCreateBase(input),
      format: input.format ? DateFormat.fromString(input.format) : undefined,
    }
  }

  get formatString(): string {
    return this.props.format?.unpack() ?? DEFAULT_DATE_FORMAT
  }

  set format(format: DateFormat | undefined) {
    this.props.format = format
  }

  get format(): DateFormat | undefined {
    return this.props.format
  }

  public override update(
    input: IUpdateDateFieldInput | IUpdateDateRangeFieldInput | IUpdateCreatedAtFieldInput | IUpdateUpdatedAtFieldInput,
  ): Option<TableCompositeSpecificaiton> {
    return this.updateDate(input)
  }

  protected updateDate<
    T extends
      | IUpdateDateFieldInput
      | IUpdateDateRangeFieldInput
      | IUpdateCreatedAtFieldInput
      | IUpdateUpdatedAtFieldInput,
  >(input: T): Option<TableCompositeSpecificaiton> {
    const specs: TableCompositeSpecificaiton[] = []
    const spec = super.updateBase(input)
    if (spec.isSome()) {
      specs.push(spec.unwrap())
    }

    if (isString(input.format)) {
      specs.push(WithFormat.fromString(this, input.format))
    }

    return and(...specs)
  }
}
