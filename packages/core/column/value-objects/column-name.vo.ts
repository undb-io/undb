import { ValueObject } from '@egodb/domain'
import * as z from 'zod'

export const columnNameSchema = z.string().trim().min(2).max(20)

export class ColumnName extends ValueObject<string> {
  private constructor(value: string) {
    super({ value })
  }

  public get value(): string {
    return this.props.value
  }

  static create(value: string): ColumnName {
    return new this(columnNameSchema.parse(value))
  }

  static unsafaCreate(value: string): ColumnName {
    return new this(value)
  }
}
