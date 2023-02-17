import { ValueObject } from '@egodb/domain'
import { map, pipe, toArray } from '@fxts/core'
import { isEmpty, unzip } from 'lodash-es'
import type { Option } from 'oxide.ts'
import { None } from 'oxide.ts'
import * as z from 'zod'
import type { IFilter, IOperator } from '../filter/index.js'
import type { IRecordDisplayValues } from '../record/index.js'
import type {
  IBaseField,
  IFieldType,
  IParentField,
  IReference,
  IReferenceField,
  ITreeField,
  SystemField,
} from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { fieldIdSchema } from './value-objects/field-id.schema.js'
import { fieldNameSchema } from './value-objects/field-name.schema.js'
import type { FieldId, FieldName } from './value-objects/index.js'
import { valueConstraintsSchema } from './value-objects/index.js'

export const createBaseFieldsSchema = z
  .object({
    id: fieldIdSchema.optional(),
    name: fieldNameSchema,
  })
  .merge(valueConstraintsSchema)

export type IBaseCreateFieldsSchema = z.infer<typeof createBaseFieldsSchema>

export const baseFieldQuerySchema = z.object({ id: fieldIdSchema, name: fieldNameSchema }).merge(valueConstraintsSchema)

export abstract class BaseField<C extends IBaseField> extends ValueObject<C> {
  abstract type: IFieldType
  system = false

  isSystem(): this is SystemField {
    return this.system
  }

  public get id(): FieldId {
    return this.props.id
  }

  public get name(): FieldName {
    return this.props.name
  }

  public get required(): boolean {
    return this.props.valueConstrains.required
  }

  abstract createFilter(operator: IOperator, value: unknown): IFilter

  abstract accept(visitor: IFieldVisitor): void
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
