import { ValueObject } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { z } from 'zod'
import type { Field } from '../field/index.js'
import type { IRootFilter } from '../filter/index.js'
import { convertFilterSpec, isEmptyFilter } from '../filter/index.js'
import type { RecordCompositeSpecification } from '../record/index.js'
import type { FormFieldsOrder } from './form-fields-order.vo.js'

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

  public getSpec(fieldId: string, userId: string, order: FormFieldsOrder): Option<RecordCompositeSpecification> {
    if (!this.filter) return None
    const previousFieldIds = order.getPreviousFieldIds(fieldId)
    return convertFilterSpec(this.filter, userId, Some(previousFieldIds))
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
