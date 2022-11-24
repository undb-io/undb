import { ValueObject } from '@egodb/domain'
import * as z from 'zod'

export const tableNameSchema = z.string().min(2).max(20)

export class TableName extends ValueObject<string> {
  constructor(name: string) {
    super({
      value: tableNameSchema.parse(name),
    })
  }

  get value(): string {
    return this.props.value
  }
}
