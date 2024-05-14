import { inject, singleton } from "@undb/di"
import { None, Option, Some } from "@undb/domain"
import {
  TableComositeSpecification,
  TableIdSpecification,
  injectTableOutboxService,
  type ITableOutboxService,
  type ITableRepository,
  type TableDo,
  type TableId,
} from "@undb/table"
import { eq } from "drizzle-orm"
import type { Database } from "../db"
import { injectDb } from "../db.provider"
import { tables } from "../tables"
import { UnderlyingTableService } from "../underlying/underlying-table.service"
import { TableDbQuerySpecHandler } from "./table-db.query-spec-handler"
import { TableMapper } from "./table.mapper"
import { injectTableMapper } from "./table.mapper.provider"
import { TableMutationVisitor } from "./table.mutation-visitor"

@singleton()
export class TableRepository implements ITableRepository {
  constructor(
    @injectDb()
    private readonly db: Database,
    @injectTableMapper()
    private readonly mapper: TableMapper,
    @inject(UnderlyingTableService)
    private readonly underlyingTableService: UnderlyingTableService,
    @injectTableOutboxService()
    private readonly outboxService: ITableOutboxService,
  ) {}

  async updateOneById(table: TableDo, spec: Option<TableComositeSpecification>): Promise<void> {
    if (spec.isNone()) {
      return
    }

    const visitor = new TableMutationVisitor(table)
    spec.unwrap().accept(visitor)

    await this.db.update(tables).set(visitor.updates).where(eq(tables.id, table.id.value))
    await this.outboxService.save(table.domainEvents)
  }

  async insert(table: TableDo): Promise<void> {
    const values = this.mapper.toEntity(table)

    await this.db.insert(tables).values(values)
    await this.underlyingTableService.create(table)
    await this.outboxService.save(table.domainEvents)
  }

  async findOneById(id: TableId): Promise<Option<TableDo>> {
    const qb = this.db.select().from(tables).$dynamic()

    const spec = Some(new TableIdSpecification(id))
    const tb = await new TableDbQuerySpecHandler(qb).handle(spec).limit(1)

    return tb.length ? Some(this.mapper.toDo(tb[0])) : None
  }
}
