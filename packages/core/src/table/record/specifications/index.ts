import type { IRootFilter } from '../../filter/filter.js'
import { convertFilterSpec } from '../../filter/filter.js'
import type { Table } from '../../table.js'
import type { RecordCompositeSpecification } from './interface.js'
import { withQ } from './record-search.specification.js'
import { WithRecordTableId } from './record-table-id.specification.js'

export * from './attachment.specification.js'
export * from './bool.specification.js'
export * from './collaborator.specification.js'
export * from './date-range.specification.js'
export * from './date.specification.js'
export type { IRecordSpec, IRecordVisitor, RecordCompositeSpecification } from './interface.js'
export * from './json.specification.js'
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

export const withTableRecordsSpec = (
  table: Table,
  userId: string,
  customFilter?: IRootFilter,
  q?: string,
): RecordCompositeSpecification => {
  let spec: RecordCompositeSpecification = WithRecordTableId.fromString(table.id.value).unwrap()

  if (customFilter) {
    const querySpec = convertFilterSpec(customFilter, userId)
    spec = spec.and(querySpec.unwrap())
  }

  const search = withQ(table, q)
  if (search.isSome()) spec = spec.and(search.unwrap())

  return spec
}

export const withTableViewRecordsSpec = (
  table: Table,
  userId: string,
  viewId?: string,
  customFilter?: IRootFilter,
  q?: string,
): RecordCompositeSpecification => {
  const filter = table.getSpec(userId, viewId)

  let spec = withTableRecordsSpec(table, userId, customFilter, q)

  if (filter.isSome()) {
    spec = spec.and(filter.unwrap())
  }

  return spec
}
