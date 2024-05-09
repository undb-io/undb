import { z } from 'zod'
import { ValueObject } from './value-object.js'

export const emailSchema = z.string().email()

export class EmailVO extends ValueObject<z.infer<typeof emailSchema>> {
  static fromString(email: string): EmailVO {
    return new this({ value: emailSchema.parse(email) })
  }
}
