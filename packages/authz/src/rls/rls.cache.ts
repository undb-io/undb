import type { IKVCache } from '@undb/domain'
import type { IQueryRLS } from './rls.schema.js'

export type IRLSCache = IKVCache<IQueryRLS>
