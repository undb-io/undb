import { ValueObject } from '@undb/domain'
import { z } from 'zod'
import type { Field } from '../field/index.js'
import type { IRootFilter } from '../filter/index.js'
import { isEmptyFilter } from '../filter/index.js'

export const formField = z.object({
  hidden: z.boolean().optional(),
  required: z.boolean(),
  filter: z.any().nullable(),
})

export type IFormField = z.infer<typeof formField>

export class FormField extends ValueObject<IFormField> {
  public get required(): boolean {
    return this.props.required
  }

  public get hidden(): boolean {
    return !!this.props.hidden
  }

  public get hasFilter(): boolean {
    return !!this.filter && !isEmptyFilter(this.filter)
  }

  public get filter() {
    return this.props.filter
  }

  public set filter(filter: IRootFilter | null) {
    this.props.filter = filter
  }

  static getDefault(field: Field): FormField {
    return new this({
      hidden: false,
      required: field.required,
      filter: null,
    })
  }
}
