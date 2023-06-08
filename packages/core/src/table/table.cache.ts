import type { IKVCache } from '@undb/domain'
import type { IQueryTable } from './table.js'

export type ITableCache = IKVCache<IQueryTable>
