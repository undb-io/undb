import { createParser } from "@undb/formula"
import { createLogger } from "@undb/logger"
import {
  AttachmentField,
  ButtonField,
  CheckboxField,
  CreatedByField,
  CurrencyField,
  DateField,
  DateRangeField,
  DurationField,
  EmailField,
  FormulaField,
  ID_TYPE,
  JsonField,
  LongTextField,
  PercentageField,
  RatingField,
  ReferenceField,
  RollupField,
  SelectField,
  UpdatedByField,
  UrlField,
  UserField,
  type AutoIncrementField,
  type CreatedAtField,
  type IFieldVisitor,
  type IdField,
  type NumberField,
  type StringField,
  type UpdatedAtField,
} from "@undb/table"
import { AlterTableBuilder, AlterTableColumnAlteringBuilder, CompiledQuery, CreateTableBuilder, sql } from "kysely"
import type { IDbProvider } from "../db.provider"
import type { IQueryBuilder } from "../qb.type"
import { JoinTable } from "./reference/join-table"
import { getUnderlyingFormulaType } from "./underlying-formula.util"
import { UnderlyingFormulaVisitor } from "./underlying-formula.visitor"
import type { UnderlyingTable } from "./underlying-table"
import { getDateRangeFieldName } from "./underlying-table.util"

export class UnderlyingTableFieldVisitor<TB extends CreateTableBuilder<any, any> | AlterTableBuilder>
  implements IFieldVisitor
{
  constructor(
    private readonly qb: IQueryBuilder,
    private readonly t: UnderlyingTable,
    public tb: TB,
    private readonly dbProvider: IDbProvider,
    public readonly isNew: boolean = false,
  ) {}
  public atb: AlterTableColumnAlteringBuilder | CreateTableBuilder<any, any> | null = null

  private logger = createLogger(UnderlyingFormulaVisitor.name)

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

    if (this.dbProvider.isPostgres()) {
      const query = sql
        .raw(
          `
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."${field.id.value}" = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customer_modtime_${tableName} BEFORE UPDATE ON ${tableName} FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();
`,
        )
        .compile(this.qb)

      this.#sql.push(query)
    } else {
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
  }
  autoIncrement(field: AutoIncrementField): void {
    if (this.dbProvider.isPostgres()) {
      const c = this.tb.addColumn(field.id.value, "bigserial", (b) => b.primaryKey())
      this.addColumn(c)
    } else {
      const c = this.tb.addColumn(field.id.value, "integer", (b) => b.primaryKey().autoIncrement())
      this.addColumn(c)
    }
  }
  createdAt(field: CreatedAtField): void {
    const c = this.tb.addColumn(field.id.value, "timestamp", (b) => b.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    this.addColumn(c)
  }
  createdBy(field: CreatedByField): void {
    const c = this.tb.addColumn(field.id.value, "text")
    this.addColumn(c)
  }
  updatedBy(field: UpdatedByField): void {
    const c = this.tb.addColumn(field.id.value, "text")
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
  longText(field: LongTextField): void {
    const c = this.tb.addColumn(field.id.value, "text")
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
  button(field: ButtonField): void {}
  currency(field: CurrencyField): void {
    const c = this.tb.addColumn(field.id.value, "integer")
    this.addColumn(c)
  }
  email(field: EmailField): void {
    const c = this.tb.addColumn(field.id.value, "varchar(255)")
    this.addColumn(c)
  }
  url(field: UrlField): void {
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
    const c = this.tb.addColumn(field.id.value, "timestamp")
    this.addColumn(c)
  }
  dateRange(field: DateRangeField): void {
    const { start, end } = getDateRangeFieldName(field)

    const startColumn = this.tb.addColumn(start, "timestamp")
    this.addColumn(startColumn)

    const endColumn = this.tb.addColumn(end, "timestamp")
    this.addColumn(endColumn)
  }
  json(field: JsonField): void {
    const c = this.tb.addColumn(field.id.value, "json")
    this.addColumn(c)
  }
  percentage(field: PercentageField): void {
    const c = this.tb.addColumn(field.id.value, "real")
    this.addColumn(c)
  }
  reference(field: ReferenceField): void {
    const joinTable = new JoinTable(this.t.table, field)

    const sql = this.qb.schema
      .createTable(joinTable.getTableName())
      .ifNotExists()
      .addColumn(joinTable.getSymmetricValueFieldId(), "varchar(255)", (b) => b.notNull())
      .addColumn(joinTable.getValueFieldId(), "varchar(255)", (b) => b.notNull())
      .addPrimaryKeyConstraint(joinTable.getTableName() + "_primary_key", [
        joinTable.getSymmetricValueFieldId(),
        joinTable.getValueFieldId(),
      ])
      .compile()
    this.addSql(sql)
  }
  rollup(field: RollupField): void {}
  checkbox(field: CheckboxField): void {
    const defaultValue = this.dbProvider.isPostgres() ? false : 0
    const c = this.tb.addColumn(field.id.value, "boolean", (b) => b.defaultTo(defaultValue).notNull())
    this.addColumn(c)
  }
  duration(field: DurationField): void {
    const c = this.tb.addColumn(field.id.value, "integer")
    this.addColumn(c)
  }
  user(field: UserField): void {
    if (field.isSingle) {
      const c = this.tb.addColumn(field.id.value, "text")
      this.addColumn(c)
    } else {
      const c = this.tb.addColumn(field.id.value, "json")
      this.addColumn(c)
    }
  }
  formula(field: FormulaField): void {
    const visitor = new UnderlyingFormulaVisitor(this.t.table)
    const parser = createParser(field.fn)
    const parsed = visitor.visit(parser.formula())

    this.logger.debug("parsed formula", { parsed })

    const type = getUnderlyingFormulaType(field.returnType)
    const c = this.tb.addColumn(field.id.value, type, (b) => {
      const column = b.generatedAlwaysAs(sql.raw(parsed))
      if (this.dbProvider.isPostgres()) {
        return column.stored()
      }
      return this.isNew ? column.stored() : column
    })
    this.addColumn(c)
  }
}
