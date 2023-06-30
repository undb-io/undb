import type { IRootFilter } from '../../filter/filter.js'
import { convertFilterSpec } from '../../filter/filter.js'
import type { Table } from '../../table.js'
import { withQ } from './record-search.specification.js'
import { WithRecordTableId } from './record-table-id.specification.js'

export * from './attachment.specification.js'
export * from './bool.specification.js'
export * from './collaborator.specification.js'
export * from './date-range.specification.js'
export * from './date.specification.js'
export type { IRecordSpec, IRecordVisitor } from './interface.js'
export * from './multi-select.specification.js'
export * from './number.specification.js'
export * from './parent.specification.js'
export * from './record-auto-increment.specification.js'
export * from './record-created-at.specification.js'
export * from './record-created-by.specification.js'
export * from './record-display-values.specification.js'
export * from './record-id.specification.js'
export * from './record-search.specification.js'
export * from './record-table-id.specification.js'
export * from './record-updated-at.specification.js'
export * from './record-updated-by.specification.js'
export * from './record-values.specification.js'
export * from './reference.specification.js'
export * from './select.specification.js'
export * from './string.specification.js'
export * from './tree.specification.js'

export const withTableRecordsSpec = (table: Table, viewId?: string, customFilter?: IRootFilter, q?: string) => {
  const filter = table.getSpec(viewId)

  let spec = WithRecordTableId.fromString(table.id.value)
    .map((s) => (filter.isNone() ? s : s.and(filter.unwrap())))
    .unwrap()

  if (customFilter) {
    const querySpec = convertFilterSpec(customFilter)
    spec = spec.and(querySpec.unwrap())
  }

  const search = withQ(table, q)
  if (search.isSome()) spec = spec.and(search.unwrap())

  return spec
}
