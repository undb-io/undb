import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { isEqual } from "radash"
import { fieldId } from "../../../schema"

export const viewField = z.object({
  fieldId,
  hidden: z.boolean(),
})

export const viewFields = viewField.array()

export type IViewFields = z.infer<typeof viewFields>

export class ViewFields extends ValueObject<IViewFields> {
  constructor(props: IViewFields) {
    super(props)
  }

  public isEqual(sort: IViewFields): boolean {
    return isEqual(sort, this.props)
  }

  public toJSON(): IViewFields {
    return [...this.props]
  }

  public fieldIds(): Set<string> {
    return this.props.reduce((acc, { fieldId }) => acc.add(fieldId), new Set<string>())
  }
}
