import { None } from '@undb/domain'
import type { TableQueryService } from '../table.query-service'

export async function getTablesMethod(this: TableQueryService) {
  return this.repo.find(None)
}
