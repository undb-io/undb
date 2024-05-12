import type { IFieldFilter, MaybeFieldFilter } from '../schema/fields/field-filter.type'

type Conjunction = 'and' | 'or'

export type IFilterGroupChildren = Array<IFieldFilter | IFilterGroup>

export interface IFilterGroup {
  conjunction: Conjunction
  children: IFilterGroupChildren
}

export type IRootFilter = IFilterGroup

export interface MaybeFilterGroup {
  conjunction: Conjunction
  children: Array<MaybeFieldFilter | MaybeFilterGroup>
}
