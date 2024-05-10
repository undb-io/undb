import { container } from '@undb/di'
import { RecordQueryRepository, TableQueryRepository, TableRepository } from '@undb/persistence'
import { RECORD_QUERY_REPOSITORY, TABLE_QUERY_REPOSITORY, TABLE_REPOSITORY } from '@undb/table'

export const registerDb = () => {
  container.register(TABLE_REPOSITORY, TableRepository)
  container.register(TABLE_QUERY_REPOSITORY, TableQueryRepository)
  container.register(RECORD_QUERY_REPOSITORY, RecordQueryRepository)
}
