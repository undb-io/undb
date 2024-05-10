import { inject } from '@undb/di'

export const RECORD_QUERY_REPOSITORY = Symbol('RECORD_QUERY_REPOSITORY')
export const injectRecordQueryRepository = () => inject(RECORD_QUERY_REPOSITORY)
