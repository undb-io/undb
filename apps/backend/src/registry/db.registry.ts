import { container } from '@undb/di'
import { TableQueryRepository, TableRepository } from '@undb/persistence'
import { TABLE_QUERY_REPOSITORY, TABLE_REPOSITORY } from '@undb/table'

export const registerDb = () => {
  container.register(TABLE_REPOSITORY, TableRepository)
  container.register(TABLE_QUERY_REPOSITORY, TableQueryRepository)
}
