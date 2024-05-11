import type { IFieldFilter } from '../schema/fields/field-filter.type'

export interface IFilterGroup {
  conjunction: 'and' | 'or'
  children: Array<IFieldFilter | IFilterGroup>
}
