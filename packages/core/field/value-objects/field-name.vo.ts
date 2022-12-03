import { ValueObject } from '@egodb/domain'
import * as z from 'zod'

export const fieldNameSchema = z.string().trim().min(2).max(20)

export class FieldName extends ValueObject<string> {
  private constructor(value: string) {
    super({ value })
  }

  public get value(): string {
    return this.props.value
  }

  static create(value: string): FieldName {
    return new this(fieldNameSchema.parse(value))
  }

  static unsafaCreate(value: string): FieldName {
    return new this(value)
  }
}
