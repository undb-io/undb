import type { Table } from '@egodb/core'

export type ICreateFieldProps = {
  onCancel?: () => void
  onSuccess?: () => void
  table: Table
}
