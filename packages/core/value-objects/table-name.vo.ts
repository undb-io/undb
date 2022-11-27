import { ValueObject } from '@egodb/domain'
import * as z from 'zod'

export const tableNameSchema = z.string().min(2).max(20)

export class TableName extends ValueObject<string> {
  private constructor(name: string) {
    super({
      value: name,
    })
  }

  static create(name: string): TableName {
    return new this(tableNameSchema.parse(name))
  }

  static unsafeCreate(name: string): TableName {
    return new this(name)
  }

  get value(): string {
    return this.props.value
  }
}
