import {
  DateRangeField,
  ID_TYPE,
  PercentageField,
  type AttachmentField,
  type AutoIncrementField,
  type ButtonField,
  type CheckboxField,
  type CreatedAtField,
  type CreatedByField,
  type CurrencyField,
  type DateField,
  type DurationField,
  type EmailField,
  type Field,
  type IFieldVisitor,
  type IdField,
  type JsonField,
  type LongTextField,
  type NumberField,
  type RatingField,
  type ReferenceField,
  type RollupField,
  type SelectField,
  type StringField,
  type TableDo,
  type UpdatedAtField,
  type UpdatedByField,
  type UrlField,
  type UserField,
} from "@undb/table"
import type { FormulaField } from "@undb/table/src/modules/schema/fields/variants/formula-field"
import { getTableName } from "drizzle-orm"
import { sql, type QueryCreator, type SelectExpression } from "kysely"
import type { IRecordQueryBuilder } from "../qb.type"
import { users } from "../schema/sqlite"
import { JoinTable } from "../underlying/reference/join-table"
import { UnderlyingTable } from "../underlying/underlying-table"
import { getRollupFn } from "../underlying/underlying-table.util"
import type { IDatabaseFnUtil } from "../utils/fn.util"
import { getJsonExpandedFieldName } from "./record-utils"

export class RecordQueryCreatorVisitor implements IFieldVisitor {
  constructor(
    private readonly qb: IRecordQueryBuilder,
    private readonly table: TableDo,
    private readonly foreignTables: Map<string, TableDo>,
    private readonly visibleFields: Field[],
    private readonly dbFnUtil: IDatabaseFnUtil,
  ) {}

  #creator: QueryCreator<any> | null = null

  get creator() {
    return this.#creator
  }

  create() {
    // handle select fields
    const referenceFields = this.table.schema.getReferenceFields(this.visibleFields)
    for (const referenceField of referenceFields) {
      referenceField.accept(this)
    }

    const userFields = this.table.schema.getUserFields(this.visibleFields)
    for (const userField of userFields) {
      userField.accept(this)
    }

    return this.#creator ?? this.qb
  }

  id(field: IdField): void {}
  autoIncrement(field: AutoIncrementField): void {}
  createdAt(field: CreatedAtField): void {}
  createdBy(field: CreatedByField): void {}
  updatedAt(field: UpdatedAtField): void {}
  updatedBy(field: UpdatedByField): void {}
  string(field: StringField): void {}
  currency(field: CurrencyField): void {}
  number(field: NumberField): void {}
  rating(field: RatingField): void {}
  select(field: SelectField): void {}
  email(field: EmailField): void {}
  url(field: UrlField): void {}
  date(field: DateField): void {}
  dateRange(field: DateRangeField): void {}
  attachment(field: AttachmentField): void {}
  json(field: JsonField): void {}
  longText(field: LongTextField): void {}
  button(field: ButtonField): void {}
  duration(field: DurationField): void {}
  percentage(field: PercentageField): void {}
  formula(field: FormulaField): void {}
  user(field: UserField): void {
    if (field.isMultiple) {
      const usersTable = getTableName(users)
      const tableName = this.table.id.value
      const expandedName = getJsonExpandedFieldName(field)
      this.#creator = (this.#creator || this.qb)
        .with(expandedName, (db) =>
          db
            .selectFrom([
              tableName,
              sql.raw(`json_each(COALESCE(${tableName}.${field.id.value}, '[]'))`).as("json_each"),
            ])
            .select([`${tableName}.${ID_TYPE}`, `json_each.value as ${field.id.value}`]),
        )
        .with(field.id.value, (db) =>
          db
            .selectFrom(expandedName)
            .select([
              `${expandedName}.${ID_TYPE}`,
              `${usersTable}.${users.username.name} as ${users.username.name}`,
              `${usersTable}.${users.email.name} as ${users.email.name}`,
            ])
            .innerJoin(usersTable, `${expandedName}.${field.id.value}`, `${usersTable}.${users.id.name}`),
        )
    }
  }
  checkbox(field: CheckboxField): void {}
  reference(field: ReferenceField): void {
    const foreignTable = this.foreignTables.get(field.foreignTableId)
    if (!foreignTable) {
      return
    }

    const rollupFields = field.getRollupFields(this.visibleFields)

    const underlyingForiegnTable = new UnderlyingTable(foreignTable)

    const joinTable = new JoinTable(this.table, field)
    const name = joinTable.getTableName()
    const valueField = joinTable.getValueFieldId()
    const symmetricField = joinTable.getSymmetricValueFieldId()

    const visible = this.visibleFields.some((f) => f.id.equals(field.id))
    const displayFields = visible ? foreignTable.schema.getDisplayFields() : []

    this.#creator = (this.#creator || this.qb).with(field.id.value, (db) =>
      db
        .selectFrom(name)
        .innerJoin(
          underlyingForiegnTable.name,
          `${name}.${symmetricField}`,
          `${underlyingForiegnTable.name}.${ID_TYPE}`,
        )
        .select(
          (sb) =>
            [
              `${name}.${valueField} as ${ID_TYPE}`,
              visible
                ? sb.fn(this.dbFnUtil.jsonGroupArray, [sb.ref(`${name}.${symmetricField}`)]).as(field.id.value)
                : undefined,
              // select display fields for reference
              ...displayFields.map((f) =>
                sb
                  .fn(this.dbFnUtil.jsonGroupArray, [sb.ref(`${underlyingForiegnTable.name}.${f.id.value}`)])
                  .as(f.id.value),
              ),
              ...rollupFields.map((rollupField) =>
                sb
                  .fn(getRollupFn(rollupField.fn, this.dbFnUtil), [
                    sb.ref(`${underlyingForiegnTable.name}.${rollupField.rollupFieldId}`),
                  ])
                  .as(rollupField.id.value),
              ),
            ].filter(Boolean) as SelectExpression<any, any>[],
        )
        .groupBy(`${name}.${valueField}`),
    )
  }
  rollup(field: RollupField): void {}
}
