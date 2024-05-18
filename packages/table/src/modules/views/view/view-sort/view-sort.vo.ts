import { z } from "zod"
import { fieldId } from "../../../schema"
import { ValueObject } from "@undb/domain"
import { isEqual } from "radash"

export const viewSortOption = z.object({
  fieldId,
  direction: z.enum(["asc", "desc"]),
})

export const viewSort = viewSortOption.array()

export type IViewSort = z.infer<typeof viewSort>

export class ViewSort extends ValueObject<IViewSort> {
  constructor(props: IViewSort) {
    super(props)
  }

  public isEqual(sort: IViewSort): boolean {
    return isEqual(sort, this.value)
  }

  public toJSON(): IViewSort {
    return [...this.value]
  }

  public get count() {
    return this.value.length
  }
}
