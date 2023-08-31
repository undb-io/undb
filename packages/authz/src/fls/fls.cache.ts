import type { IKVCache } from '@undb/domain'
import type { IQueryFLS } from './fls.schema.js'

export type IFLSCache = IKVCache<IQueryFLS>
