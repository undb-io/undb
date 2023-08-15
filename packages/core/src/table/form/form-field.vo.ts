import { ValueObject } from '@undb/domain'
import { z } from 'zod'
import type { Field } from '../field/index.js'
import { rootFilter } from '../filter/index.js'

export const formField = z.object({
  hidden: z.boolean().optional(),
  required: z.boolean(),
  filter: rootFilter.optional(),
})

export type IFormField = z.infer<typeof formField>

export class FormField extends ValueObject<IFormField> {
  public get required(): boolean {
    return this.props.required
  }

  public get hidden(): boolean {
    return !!this.props.hidden
  }

  static getDefault(field: Field): FormField {
    return new this({
      hidden: false,
      required: field.required,
      filter: undefined,
    })
  }
}
