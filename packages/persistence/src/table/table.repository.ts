import { inject, singleton } from '@undb/di'
import { None, Option, Some } from '@undb/domain'
import { TableIdSpecification, type ITableRepository, type TableDo, type TableId } from '@undb/table'
import type { Database } from '../db'
import { injectDb } from '../db.provider'
import { tables } from '../tables'
import { UnderlyingTableService } from '../underlying/underlying-table.service'
import { TableDbQuerySpecHandler } from './table-db.query-spec-handler'
import { TableMapper } from './table.mapper'
import { injectTableMapper } from './table.mapper.provider'

@singleton()
export class TableRepository implements ITableRepository {
  constructor(
    @injectDb()
    private readonly db: Database,
    @injectTableMapper()
    private readonly mapper: TableMapper,
    @inject(UnderlyingTableService)
    private readonly underlyingTableService: UnderlyingTableService
  ) {}

  async insert(table: TableDo): Promise<void> {
    const values = this.mapper.toEntity(table)
    await this.db.insert(tables).values(values)
    await this.underlyingTableService.create(table)
  }

  async findOneById(id: TableId): Promise<Option<TableDo>> {
    const qb = this.db.select().from(tables).$dynamic()

    const spec = Some(new TableIdSpecification(id))
    const tb = await new TableDbQuerySpecHandler(qb).handle(spec).limit(1)

    return tb.length ? Some(this.mapper.toDo(tb[0])) : None
  }
}
