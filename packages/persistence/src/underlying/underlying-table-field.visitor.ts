import {
  AttachmentField,
  CheckboxField,
  CreatedByField,
  DateField,
  ID_TYPE,
  JsonField,
  RatingField,
  ReferenceField,
  RollupField,
  SelectField,
  UpdatedByField,
  UserField,
  type AutoIncrementField,
  type CreatedAtField,
  type IFieldVisitor,
  type IdField,
  type NumberField,
  type StringField,
  type UpdatedAtField,
} from "@undb/table"
import type { EmailField } from "@undb/table/src/modules/schema/fields/variants/email-field"
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

    const query = sql
      .raw(
        `
      CREATE TRIGGER IF NOT EXISTS update_at_update_${tableName} AFTER UPDATE ON \`${tableName}\`
      BEGIN
        update \`${tableName}\` SET ${field.id.value} = datetime('now') WHERE ${ID_TYPE} = NEW.${ID_TYPE};
      END;
    `,
      )
      .compile(this.qb)

    this.#sql.push(query)
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
  select(field: SelectField): void {
    const c = this.tb.addColumn(field.id.value, field.isSingle ? "varchar(255)" : "json")
    this.addColumn(c)
  }
  number(field: NumberField): void {
    const c = this.tb.addColumn(field.id.value, "real")
    this.addColumn(c)
  }
  email(field: EmailField): void {
    const c = this.tb.addColumn(field.id.value, "varchar(255)")
    this.addColumn(c)
  }
  rating(field: RatingField): void {
    const c = this.tb.addColumn(field.id.value, "real")
    this.addColumn(c)
  }
  attachment(field: AttachmentField): void {
    const c = this.tb.addColumn(field.id.value, "json")
    this.addColumn(c)
  }
  date(field: DateField): void {
    const c = this.tb.addColumn(field.id.value, "datetime")
    this.addColumn(c)
  }
  json(field: JsonField): void {
    const c = this.tb.addColumn(field.id.value, "json")
    this.addColumn(c)
  }
  reference(field: ReferenceField): void {
    const joinTable = new JoinTable(this.t.table, field)
    const option = field.option.expect("expect reference option")

    const isOwner = option.isOwner

    if (isOwner) {
      const sql = this.qb.schema
        .createTable(joinTable.getTableName())
        .ifNotExists()
        .addColumn(joinTable.getSymmetricValueFieldId(), "varchar(10)", (b) =>
          b.references(`${field.foreignTableId}.${ID_TYPE}`).notNull().onDelete("cascade"),
        )
        .addColumn(joinTable.getValueFieldId(), "varchar(10)", (b) =>
          b.references(`${this.t.table.id.value}.${ID_TYPE}`).notNull().onDelete("cascade"),
        )
        .addPrimaryKeyConstraint("primary_key", [joinTable.getSymmetricValueFieldId(), joinTable.getValueFieldId()])
        .compile()
      this.addSql(sql)
    }
  }
  rollup(field: RollupField): void {}
  checkbox(field: CheckboxField): void {
    const c = this.tb.addColumn(field.id.value, "boolean")
    this.addColumn(c)
  }
  user(field: UserField): void {
    if (field.isSingle) {
      const user = getTableName(users)
      const c = this.tb.addColumn(field.id.value, "text", (b) =>
        b.references(`${user}.${users.id.name}`).onDelete("restrict"),
      )
      this.addColumn(c)
    } else {
      const c = this.tb.addColumn(field.id.value, "json")
      this.addColumn(c)
    }
  }
}
