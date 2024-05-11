import { z } from 'zod'
import { FieldIdVo } from '../../field-id.vo'
import type { IFieldVisitor } from '../../field.visitor'
import { AbstractField,baseFieldDTO,createBaseFieldDTO } from '../abstract-field.vo'
import { StringFieldValue } from './string-field-value.vo'

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
}
