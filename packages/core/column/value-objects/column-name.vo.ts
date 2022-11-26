import { ValueObject } from '@egodb/domain'
import * as z from 'zod'

export const columnNameSchema = z.string().min(2).max(20)

export class ColumnName extends ValueObject<string> {
  constructor(value: string) {
    super({ value: columnNameSchema.parse(value) })
  }
}
