import type {
  INTERNAL_COLUMN_CREATED_AT_NAME,
  INTERNAL_COLUMN_CREATED_BY_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_AT_NAME,
  INTERNAL_COLUMN_UPDATED_BY_NAME,
  INTERNAL_INCREMENT_ID_NAME,
} from '@undb/core'
import type { INTERNAL_COLUMN_EXPAND_NAME } from './record.util'

export type ExpandColumnName = `${string}_${typeof INTERNAL_COLUMN_EXPAND_NAME}`

export interface RecordSqlite {
  [INTERNAL_COLUMN_ID_NAME]: string
  [INTERNAL_COLUMN_CREATED_AT_NAME]: string
  [INTERNAL_COLUMN_CREATED_BY_NAME]: string
  [INTERNAL_COLUMN_UPDATED_AT_NAME]: string
  [INTERNAL_COLUMN_UPDATED_BY_NAME]: string
  [INTERNAL_INCREMENT_ID_NAME]?: number
  /**
   * json string aggregated by json_object internal sqlite function
   */
  [key: ExpandColumnName]: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface RecordSqliteWithParent extends RecordSqlite {
  parent_id: string
}

export type RecordSqliteWithChildren = Array<RecordSqlite & { children: RecordSqliteWithChildren }>
