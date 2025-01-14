import { injectContext, type IContext } from "@undb/context"
import { inject, singleton } from "@undb/di"
import { createLogger } from "@undb/logger"
import type { TableComositeSpecification, TableDo } from "@undb/table"
import type { CompiledQuery } from "kysely"
import type { ITxContext } from "../ctx.interface"
import { injectTxCTX } from "../ctx.provider"
import { DbProviderService, type IDbProvider } from "../db.provider"
import { DatabaseFnUtil, type IDatabaseFnUtil } from "../utils/fn.util"
import { JoinTable } from "./reference/join-table"
import { UnderlyingTable } from "./underlying-table"
import { UnderlyingTableFieldVisitor } from "./underlying-table-field.visitor"
import { UnderlyingTableSpecVisitor } from "./underlying-table-spec.visitor"

@singleton()
export class UnderlyingTableService {
  constructor(
    @injectContext() private readonly context: IContext,
    @injectTxCTX()
    private readonly txContext: ITxContext,
    @inject(DbProviderService)
    private readonly dbProvider: IDbProvider,
    @inject(DatabaseFnUtil)
    private readonly dbFnUtil: IDatabaseFnUtil,
  ) {}

  readonly logger = createLogger(UnderlyingTableService.name)

  async create(table: TableDo) {
    const t = new UnderlyingTable(table)
    const trx = this.txContext.getCurrentTransaction()
    const sql: CompiledQuery[] = []
    await trx.schema
      .createTable(t.name)
      .ifNotExists()
      .$call((tb) => {
        const visitor = new UnderlyingTableFieldVisitor(trx, t, tb, this.dbProvider, true)
        for (const field of table.schema) {
          field.accept(visitor)
        }
        sql.push(...visitor.sql)
        return visitor.tb
      })
      .execute()

    for (const query of sql) {
      await trx.executeQuery(query)
    }
  }

  async update(table: TableDo, spec: TableComositeSpecification) {
    const t = new UnderlyingTable(table)
    const trx = this.txContext.getAnonymousTransaction()

    const visitor = new UnderlyingTableSpecVisitor(t, trx, this.context, this.dbProvider, this.dbFnUtil)
    spec.accept(visitor)

    await visitor.execute()
  }

  async delete(table: TableDo) {
    const t = new UnderlyingTable(table)
    const trx = this.txContext.getCurrentTransaction()
    await trx.schema.dropTable(t.name).ifExists().execute()
    const referenceFields = table.schema.getReferenceFields()
    for (const field of referenceFields) {
      const joinTable = new JoinTable(table, field)
      await trx.schema.dropTable(joinTable.getTableName()).ifExists().execute()
    }
  }

  async deleteTables(tables: TableDo[]) {
    for (const table of tables) {
      await this.delete(table)
    }
  }
}
