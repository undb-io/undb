import { singleton } from "@undb/di"
import { None, Option, Some } from "@undb/domain"
import {
  TableIdSpecification,
  type ITableDTO,
  type ITableQueryRepository,
  type TableComositeSpecification,
  type TableId,
} from "@undb/table"
import type { Database } from "../db"
import { injectDb } from "../db.provider"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { TableDbQuerySpecHandler2 } from "./table-db.query-spec-handler"
import { TableMapper } from "./table.mapper"

@singleton()
export class TableQueryRepository implements ITableQueryRepository {
  constructor(
    @injectDb()
    private readonly db: Database,
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}

  public get mapper() {
    return new TableMapper()
  }

  async find(spec: Option<TableComositeSpecification>): Promise<ITableDTO[]> {
    const tbs = await this.qb
      .selectFrom("undb_table")
      .selectAll()
      .where((eb) => new TableDbQuerySpecHandler2(eb).handle(spec))
      .execute()

    return tbs.map((r) => this.mapper.toDTO(r))
  }

  async findOne(spec: TableComositeSpecification): Promise<Option<ITableDTO>> {
    const tb = await this.qb
      .selectFrom("undb_table")
      .selectAll()
      .where((eb) => new TableDbQuerySpecHandler2(eb).handle(Some(spec)))
      .executeTakeFirst()

    return tb ? Some(this.mapper.toDTO(tb)) : None
  }

  async findOneById(id: TableId): Promise<Option<ITableDTO>> {
    const spec = Some(new TableIdSpecification(id))
    const tb = await this.qb
      .selectFrom("undb_table")
      .selectAll()
      .where((eb) => new TableDbQuerySpecHandler2(eb).handle(spec))
      .executeTakeFirst()

    return tb ? Some(this.mapper.toDTO(tb)) : None
  }
}
