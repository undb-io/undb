import { container } from "@undb/di"
import {
  DB_UNIT_OF_WORK_PROVIDER,
  DatabaseUnitOfWork,
  RecordOutboxService,
  RecordQueryRepository,
  RecordRepository,
  TableOutboxService,
  TableQueryRepository,
  TableRepository,
} from "@undb/persistence"
import {
  RECORD_OUTBOX_SERVICE,
  RECORD_QUERY_REPOSITORY,
  RECORD_REPOSITORY,
  TABLE_OUTBOX_SERVICE,
  TABLE_QUERY_REPOSITORY,
  TABLE_REPOSITORY,
} from "@undb/table"

export const registerDb = () => {
  container.register(TABLE_REPOSITORY, TableRepository)
  container.register(TABLE_QUERY_REPOSITORY, TableQueryRepository)
  container.register(RECORD_QUERY_REPOSITORY, RecordQueryRepository)
  container.register(RECORD_REPOSITORY, RecordRepository)
  container.register(RECORD_OUTBOX_SERVICE, RecordOutboxService)
  container.register(TABLE_OUTBOX_SERVICE, TableOutboxService)
  container.register(DB_UNIT_OF_WORK_PROVIDER, DatabaseUnitOfWork)
}
