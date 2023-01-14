import type { Table } from '@egodb/core'

export type ISelectKanbanFieldProps = {
  table: Table
  onSuccess?: () => void
}
