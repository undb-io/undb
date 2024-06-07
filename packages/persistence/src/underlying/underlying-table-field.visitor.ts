import {
  CreatedByField,
  ID_TYPE,
  ReferenceField,
  UpdatedByField,
  type AutoIncrementField,
  type CreatedAtField,
  type IFieldVisitor,
  type IdField,
  type NumberField,
  type StringField,
  type UpdatedAtField,
} from "@undb/table"
import { getTableName } from "drizzle-orm"
import { AlterTableBuilder, AlterTableColumnAlteringBuilder, CompiledQuery, CreateTableBuilder, sql } from "kysely"
import type { IQueryBuilder } from "../qb"
import { users } from "../tables"
import { JoinTable } from "./reference/join-table"
import type { UnderlyingTable } from "./underlying-table"

export class UnderlyingTableFieldVisitor<TB extends CreateTableBuilder<any, any> | AlterTableBuilder>
  implements IFieldVisitor
{
  constructor(
    private readonly qb: IQueryBuilder,
    private readonly t: UnderlyingTable,
    public tb: TB,
  ) {}
  public atb: AlterTableColumnAlteringBuilder | CreateTableBuilder<any, any> | null = null
  #rawSQL: string[] = []
  get rawSQL() {
    return this.#rawSQL
  }

  private addColumn(c: AlterTableColumnAlteringBuilder | CreateTableBuilder<any, any>) {
    this.atb = c
    this.tb = c as TB
  }

  #sql: CompiledQuery[] = []
  get sql() {
    return this.#sql
  }
  addSql(sql: CompiledQuery) {
    this.#sql.push(sql)
  }

  updatedAt(field: UpdatedAtField): void {
    const tableName = this.t.name
    const c = this.tb.addColumn(field.id.value, "timestamp", (b) => b.defaultTo(sql`(CURRENT_TIMESTAMP)`).notNull())
    this.addColumn(c)

    // TODO: better solution
    const query = `
    CREATE TRIGGER IF NOT EXISTS update_at_update_${tableName} AFTER UPDATE ON \`${tableName}\`
    BEGIN
    	update \`${tableName}\` SET ${field.id.value} = datetime('now') WHERE ${ID_TYPE} = NEW.${ID_TYPE};
    END;
        `
    this.#rawSQL.push(query)
  }
  autoIncrement(field: AutoIncrementField): void {
    const c = this.tb.addColumn(field.id.value, "integer", (b) => b.autoIncrement().primaryKey())
    this.addColumn(c)
  }
  createdAt(field: CreatedAtField): void {
    const c = this.tb.addColumn(field.id.value, "timestamp", (b) => b.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    this.addColumn(c)
  }
  createdBy(field: CreatedByField): void {
    const user = getTableName(users)
    const c = this.tb.addColumn(field.id.value, "text", (b) =>
      b.references(`${user}.${users.id.name}`).notNull().onDelete("restrict"),
    )
    this.addColumn(c)
  }
  updatedBy(field: UpdatedByField): void {
    const user = getTableName(users)
    const c = this.tb.addColumn(field.id.value, "text", (b) =>
      b.references(`${user}.${users.id.name}`).notNull().onDelete("restrict"),
    )
    this.addColumn(c)
  }
  id(field: IdField): void {
    const c = this.tb.addColumn(field.id.value, "varchar(50)", (b) => b.notNull().unique())
    this.addColumn(c)
  }
  string(field: StringField): void {
    const c = this.tb.addColumn(field.id.value, "varchar(255)")
    this.addColumn(c)
  }
  number(field: NumberField): void {
    const c = this.tb.addColumn(field.id.value, "real")
    this.addColumn(c)
  }

  reference(field: ReferenceField): void {
    const joinTable = new JoinTable(this.t.table, field)
    const option = field.option.expect("expect reference option")

    const isOwner = option.isOwner

    if (isOwner) {
      const sql = this.qb.schema
        .createTable(joinTable.getName())
        .ifNotExists()
        .addColumn(field.foreignTableId, "varchar(10)", (b) =>
          b.references(`${field.foreignTableId}.${ID_TYPE}`).notNull().onDelete("cascade"),
        )
        .addColumn(field.id.value, "varchar(10)", (b) =>
          b.references(`${this.t.table.id.value}.${ID_TYPE}`).notNull().onDelete("cascade"),
        )
        .compile()
      this.addSql(sql)
    }
  }
}
