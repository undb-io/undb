import { and, ValueObject } from '@egodb/domain'
import { map, pipe, toArray } from '@fxts/core'
import { isArray, isEmpty, isString, unzip } from 'lodash-es'
import type { Option } from 'oxide.ts'
import { None } from 'oxide.ts'
import type { IFilter, IOperator } from '../filter/index.js'
import type { IRecordDisplayValues } from '../record/index.js'
import type { TableCompositeSpecificaiton } from '../specifications/interface.js'
import type { IBaseUpdateFieldSchema } from './field-base.schema'
import type {
  IBaseField,
  IFieldType,
  IParentField,
  IReference,
  IReferenceField,
  ITreeField,
  IUpdateFieldSchema,
  PrimitiveField,
  SystemField,
} from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import type { IUpdateParentFieldInput } from './parent-field.type.js'
import type { IUpdateReferenceFieldInput } from './reference-field.type.js'
import { WithFieldName } from './specifications/base-field.specification.js'
import { WithDisplayFields } from './specifications/reference-field.specification.js'
import type { IUpdateTreeFieldInput } from './tree-field.type.js'
import type { FieldId, FieldName } from './value-objects/index.js'
import { DisplayFields } from './value-objects/index.js'

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
        ['id'],
        map((id) => values?.[this.id.value]?.[id] ?? []),
        toArray,
        unzip,
      )
    }

    return pipe(
      this.displayFieldIds,
      map((displayFieldId) => values?.[this.id.value]?.[displayFieldId.value] ?? []),
      toArray,
      unzip,
    )
  }
}
