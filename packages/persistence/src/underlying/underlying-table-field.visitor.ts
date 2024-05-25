import {
  ID_TYPE,
  type AutoIncrementField,
  type CreatedAtField,
  type IFieldVisitor,
  type IdField,
  type NumberField,
  type StringField,
  type UpdatedAtField,
} from "@undb/table"
import { AlterTableBuilder, CreateTableBuilder, sql } from "kysely"
import type { UnderlyingTable } from "./underlying-table"

export class UnderlyingTableFieldVisitor<TB extends CreateTableBuilder<any, any> | AlterTableBuilder>
  implements IFieldVisitor
{
  constructor(
    private readonly t: UnderlyingTable,
    public tb: TB,
  ) {}

  #rawSQL: string[] = []

  get rawSQL() {
    return this.#rawSQL
  }

  updatedAt(field: UpdatedAtField): void {
    const tableName = this.t.name
    this.tb = this.tb.addColumn(field.id.value, "timestamp", (b) =>
      b.defaultTo(sql`(CURRENT_TIMESTAMP)`).notNull(),
    ) as TB

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
    this.tb = this.tb.addColumn(field.id.value, "integer", (b) => b.autoIncrement().primaryKey()) as TB
  }
  createdAt(field: CreatedAtField): void {
    this.tb = this.tb.addColumn(field.id.value, "timestamp", (b) => b.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()) as TB
  }
  id(field: IdField): void {
    this.tb = this.tb.addColumn(field.id.value, "varchar(50)", (b) => b.notNull().unique()) as TB
  }
  string(field: StringField): void {
    this.tb = this.tb.addColumn(field.id.value, "varchar(255)") as TB
  }
  number(field: NumberField): void {
    this.tb = this.tb.addColumn(field.id.value, "real") as TB
  }
}
