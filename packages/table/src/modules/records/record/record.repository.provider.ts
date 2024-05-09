import { inject } from '@undb/di'

export const RECORD_REPOSITORY = Symbol('RECORD_REPOSITORY')
export const injectRecordRepository = () => inject(RECORD_REPOSITORY)
