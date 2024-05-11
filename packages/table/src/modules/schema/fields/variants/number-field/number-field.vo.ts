import { match } from 'ts-pattern'
import { z } from 'zod'
import { FieldIdVo } from '../../field-id.vo'
import type { IFieldVisitor } from '../../field.visitor'
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from '../abstract-field.vo'
import { NumberEqual } from './number-field-value.specification'
import { NumberFieldValue } from './number-field-value.vo'
import type { INumberFieldFilter } from './number-field.filter'

export const NUMBER_TYPE = 'number' as const

export const createNumberFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(NUMBER_TYPE),
})

export type ICreateNumberFieldDTO = z.infer<typeof createNumberFieldDTO>

export const numberFieldDTO = baseFieldDTO.extend({
  type: z.literal(NUMBER_TYPE),
})

export type INumberFieldDTO = z.infer<typeof numberFieldDTO>

export class NumberField extends AbstractField<NumberFieldValue> {
  constructor(dto: INumberFieldDTO) {
    super(dto)
  }

  static create(dto: ICreateNumberFieldDTO) {
    return new NumberField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
  }

  override type = NUMBER_TYPE

  override get valueSchema() {
    if (this.required) {
      return z.number()
    }

    return z.number().optional()
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.number(this)
  }

  override getSpec(filter: INumberFieldFilter) {
    return match(filter)
      .with({ op: 'eq' }, ({ value }) => new NumberEqual(new NumberFieldValue(value), this.id))
      .with({ op: 'neq' }, ({ value }) => new NumberEqual(new NumberFieldValue(value), this.id).not())
      .exhaustive()
  }
}
