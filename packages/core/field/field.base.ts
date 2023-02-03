import { ValueObject } from '@egodb/domain'
import type { Option } from 'oxide.ts'
import { None } from 'oxide.ts'
import * as z from 'zod'
import type { IFilter, IOperator } from '../filter'
import type { IRecordDisplayValues } from '../record'
import type {
  IBaseField,
  IFieldType,
  IParentField,
  IReference,
  IReferenceField,
  ITreeField,
  SystemField,
} from './field.type'
import type { IFieldVisitor } from './field.visitor'
import type { FieldId, FieldName } from './value-objects'
import { valueConstraintsSchema } from './value-objects'
import { fieldIdSchema } from './value-objects/field-id.schema'
import { fieldNameSchema } from './value-objects/field-name.schema'

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

  getDisplayValues(values?: IRecordDisplayValues): ((string | null)[] | undefined)[] {
    return this.displayFieldIds.map((displayFieldId) => values?.[this.id.value]?.[displayFieldId.value] ?? undefined)
  }
}
