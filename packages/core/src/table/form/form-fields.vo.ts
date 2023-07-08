import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const formField = z.object({
  hidden: z.boolean().optional(),
})

export type IFormField = z.infer<typeof formField>

export const formFields = z.record(z.string(), formField)

export type IFormFields = z.infer<typeof formFields>

export class FormFields extends ValueObject<Map<string, IFormField>> {
  public static readonly DEFAULT: IFormField = {
    hidden: false,
  }

  static default() {
    return new this(new Map())
  }

  static from(input?: IFormFields) {
    return input ? new this(new Map(Object.entries(input))) : this.default()
  }

  public get value() {
    return this.props
  }

  public toJSON() {
    return Object.fromEntries(this.value)
  }
}
