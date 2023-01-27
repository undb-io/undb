import type { Table } from '@egodb/core'

export type ISelectTreeViewFieldProps = {
  table: Table
  onSuccess?: () => void
}
