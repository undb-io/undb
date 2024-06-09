import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"

export const viewOption = z.object({
  showSystemFields: z.boolean().optional(),
})

export type IViewOption = z.infer<typeof viewOption>

export class ViewOption extends ValueObject<IViewOption> {
  toJSON() {
    return this.props
  }

  get showSystemFields() {
    return this.props.showSystemFields ?? false
  }

  set showSystemFields(value: boolean) {
    this.props.showSystemFields = value
  }

  static default() {
    return new ViewOption({ showSystemFields: false })
  }
}
