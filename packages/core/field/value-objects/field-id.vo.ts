import { ValueObject } from '@egodb/domain'
import * as z from 'zod'
import type { FieldName } from './field-name.vo'

export const fieldIdSchema = z.string().min(1)

export class FieldId extends ValueObject<string> {
  public get value(): string {
    return this.props.value
  }

  static fromName(fieldName: FieldName): FieldId {
    return new this({ value: fieldName.value })
  }

  static from(id: string): FieldId {
    return new this({ value: id })
  }
}
