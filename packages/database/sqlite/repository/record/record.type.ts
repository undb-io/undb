import type {
  INTERNAL_COLUMN_CREATED_AT_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_AT_NAME,
  INTERNAL_INCREAMENT_ID_NAME,
} from '@egodb/core'

export interface RecordSqlite {
  [INTERNAL_COLUMN_ID_NAME]: string
  [INTERNAL_COLUMN_CREATED_AT_NAME]: string
  [INTERNAL_COLUMN_UPDATED_AT_NAME]: string
  [INTERNAL_INCREAMENT_ID_NAME]?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface RecordSqliteWithParent extends RecordSqlite {
  parent_id: string
}

export type RecordSqliteWithChildren = Array<RecordSqlite & { children: RecordSqliteWithChildren }>
