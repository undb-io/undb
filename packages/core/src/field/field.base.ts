import { and, ValueObject } from '@egodb/domain'
import { isArray, isEmpty, isString, unzip } from 'lodash-es'
import fp from 'lodash/fp.js'
import type { Option } from 'oxide.ts'
import { None } from 'oxide.ts'
import type { IFilter, IOperator } from '../filter/index.js'
import type { IRecordDisplayValues } from '../record/index.js'
import type { TableCompositeSpecificaiton } from '../specifications/interface.js'
import type { IUpdateCreatedAtFieldInput } from './created-at-field.type.js'
import type { IUpdateDateFieldInput } from './date-field.type.js'
import type { IUpdateDateRangeFieldInput } from './date-range-field.type.js'
import type { IBaseUpdateFieldSchema } from './field-base.schema.js'
import { DEFAULT_DATE_FORMAT } from './field.constants.js'
import type {
  IAbstractDateField,
  IBaseField,
  ICreatedAtField,
  IDateField,
  IDateRangeField,
  IFieldType,
  IParentField,
  IReference,
  IReferenceField,
  ITreeField,
  IUpdatedAtField,
  IUpdateFieldSchema,
  PrimitiveField,
  SystemField,
} from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import type { IUpdateParentFieldInput } from './parent-field.type.js'
import type { IUpdateReferenceFieldInput } from './reference-field.type.js'
import { WithFieldName } from './specifications/base-field.specification.js'
import { WithFormat } from './specifications/date-field.specification.js'
import { WithDisplayFields } from './specifications/reference-field.specification.js'
import type { IUpdateTreeFieldInput } from './tree-field.type.js'
import type { IUpdateUpdatedAtFieldInput } from './updated-at-field.type.js'
import type { DateFormat, FieldId, FieldName } from './value-objects/index.js'
import { DisplayFields } from './value-objects/index.js'

const { map, pipe } = fp

export abstract class BaseField<C extends IBaseField = IBaseField> extends ValueObject<C> {
  abstract type: IFieldType
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

  public get required(): boolean {
    return this.props.valueConstrains.required
  }

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
    return and(...specs)
  }
}

export abstract class BaseReferenceField<F extends ITreeField | IParentField | IReferenceField>
  extends BaseField<F>
  implements IReference
{
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

export abstract class BaseDateField<F extends IDateField | ICreatedAtField | IUpdatedAtField | IDateRangeField>
  extends BaseField<F>
  implements IAbstractDateField
{
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
