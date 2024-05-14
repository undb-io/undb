import { z } from "zod"
import { filedFilter, type IFieldFilter, type MaybeFieldFilter } from "../schema/fields/field-filter.type"

export const filterGroup: z.ZodType<IFilterGroup> = z.object({
  conjunction: z.enum(["and", "or"]),
  children: z.array(z.union([filedFilter, z.lazy(() => filterGroup)])),
})

type Conjunction = "and" | "or"

export type IFilterGroupChildren = Array<IFieldFilter | IFilterGroup>

export interface IFilterGroup {
  conjunction: Conjunction
  children: IFilterGroupChildren
}

export type IRootFilter = IFilterGroup

export interface MaybeFilterGroup {
  id: string
  conjunction: Conjunction
  children: Array<MaybeFieldFilter | MaybeFilterGroup>
}
