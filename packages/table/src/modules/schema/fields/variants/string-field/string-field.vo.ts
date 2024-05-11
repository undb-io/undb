import { Option } from '@undb/domain'
import { match } from 'ts-pattern'
import { z } from 'zod'
import { FieldIdVo } from '../../field-id.vo'
import type { IFieldVisitor } from '../../field.visitor'
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from '../abstract-field.vo'
import { StringEqual } from './string-field-value.specification'
import { StringFieldValue } from './string-field-value.vo'
import type { IStringFieldFilter } from './string-field.filter'

export const STRING_TYPE = 'string' as const

export const createStringFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(STRING_TYPE),
})

export type ICreateStringFieldDTO = z.infer<typeof createStringFieldDTO>

export const stringFieldDTO = baseFieldDTO.extend({
  type: z.literal(STRING_TYPE),
})

export type IStringFieldDTO = z.infer<typeof stringFieldDTO>

export class StringField extends AbstractField<StringFieldValue> {
  constructor(dto: IStringFieldDTO) {
    super(dto)
  }

  static create(dto: ICreateStringFieldDTO) {
    return new StringField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
  }

  override type = STRING_TYPE

  override get valueSchema() {
    if (this.required) {
      return z.string().min(1)
    }

    return z.string().optional()
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.string(this)
  }

  override getSpec(filter: IStringFieldFilter) {
    const spec = match(filter)
      .with({ op: 'eq' }, ({ value }) => new StringEqual(new StringFieldValue(value), this.id))
      .with({ op: 'neq' }, ({ value }) => new StringEqual(new StringFieldValue(value), this.id).not())
      .otherwise(() => null)

    return Option(spec)
  }
}
