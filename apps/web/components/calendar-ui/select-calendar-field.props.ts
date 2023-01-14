import type { Table } from '@egodb/core'

export type ISelectCalendarFieldProps = {
  table: Table
  onSuccess?: () => void
}
