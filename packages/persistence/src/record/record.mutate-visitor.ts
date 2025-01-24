import type { IContext } from "@undb/context"
import {
  CurrencyEqual,
  CurrencyGT,
  CurrencyGTE,
  CurrencyLT,
  CurrencyLTE,
  DateIsEmpty,
  DateRangeDateIsAfter,
  DateRangeDateIsBefore,
  DateRangeDateIsEmpty,
  DateRangeDateIsSameDay,
  DateRangeDateIsToday,
  DateRangeDateIsTomorrow,
  DateRangeDateIsYesterday,
  DateRangeEqual,
  DateRangeField,
  DateRangeIsEmpty,
  DurationEqual,
  FieldIdVo,
  FormulaEqual,
  FormulaGT,
  FormulaGTE,
  FormulaLT,
  FormulaLTE,
  ID_TYPE,
  isUserFieldMacro,
  JsonContains,
  LongTextEqual,
  PercentageEqual,
  SelectContainsAnyOf,
  SelectField,
  SelectFieldValue,
  UrlEqual,
  UserField,
  UserFieldValue,
  type AttachmentEmpty,
  type AttachmentEqual,
  type CheckboxEqual,
  type DateEqual,
  type DateIsAfter,
  type DateIsBefore,
  type DateIsSameDay,
  type DateIsToday,
  type DateIsTomorrow,
  type EmailEqual,
  type IdEqual,
  type IdIn,
  type IRecordVisitor,
  type JsonEmpty,
  type JsonEqual,
  type NumberEmpty,
  type NumberEqual,
  type NumberGT,
  type NumberGTE,
  type NumberLT,
  type NumberLTE,
  type RatingEqual,
  type RecordDO,
  type ReferenceEqual,
  type ReferenceField,
  type SelectEmpty,
  type SelectEqual,
  type StringContains,
  type StringEmpty,
  type StringEndsWith,
  type StringEqual,
  type StringMax,
  type StringMin,
  type StringStartsWith,
  type TableDo,
  type UserEmpty,
  type UserEqual,
} from "@undb/table"
import { startOfDay, startOfToday, startOfTomorrow, startOfYesterday } from "date-fns"
import { sql, type ExpressionBuilder } from "kysely"
import { unique } from "radash"
import { AbstractQBMutationVisitor } from "../abstract-qb.visitor"
import type { IDbProvider } from "../db.provider"
import type { IQueryBuilder, IRecordQueryBuilder } from "../qb.type"
import { JoinTable } from "../underlying/reference/join-table"
import { getDateRangeFieldName } from "../underlying/underlying-table.util"

export class RecordMutateVisitor extends AbstractQBMutationVisitor implements IRecordVisitor {
  constructor(
    private readonly table: TableDo,
    /**
     * if record is null it means we are mutating all records
     */
    private readonly record: RecordDO | null,
    private readonly qb: IRecordQueryBuilder,
    private readonly eb: ExpressionBuilder<any, any>,
    private readonly context: IContext,
    private readonly dbProvider: IDbProvider,
  ) {
    super()
  }

  #setDate(fieldId: string, value: Date | null) {
    if (value) {
      this.setData(fieldId, this.dbProvider.isPostgres() ? value : value.getTime())
    } else {
      this.setData(fieldId, null)
    }
  }

  idIn(spec: IdIn): void {
    throw new Error("Method not implemented.")
  }
  checkboxEqual(spec: CheckboxEqual): void {
    this.setData(spec.fieldId.value, Boolean(spec.value))
  }
  jsonEqual(spec: JsonEqual): void {
    if (!spec.json) {
      this.setData(spec.fieldId.value, null)
    } else if (typeof spec.json === "string") {
      this.setData(spec.fieldId.value, spec.json)
    } else {
      this.setData(spec.fieldId.value, JSON.stringify(spec.json))
    }
  }
  jsonContains(spec: JsonContains): void {
    throw new Error("Method not implemented.")
  }
  jsonEmpty(spec: JsonEmpty): void {
    this.setData(spec.fieldId.value, null)
  }
  dateIsEmpty(spec: DateIsEmpty): void {
    this.setData(spec.fieldId.value, null)
  }
  dateEqual(spec: DateEqual): void {
    if (spec.date === "@now") {
      const start = startOfDay(new Date())
      this.#setDate(spec.fieldId.value, start)
    } else if (spec.date === "@today") {
      const start = startOfToday()
      this.#setDate(spec.fieldId.value, start)
    } else if (spec.date === "@yesterday") {
      const start = startOfYesterday()
      this.#setDate(spec.fieldId.value, start)
    } else if (spec.date === "@tomorrow") {
      const start = startOfTomorrow()
      this.#setDate(spec.fieldId.value, start)
    } else {
      this.#setDate(spec.fieldId.value, spec.date)
    }
  }
  dateRangeEqual(spec: DateRangeEqual): void {
    const field = this.table.schema.getFieldById(new FieldIdVo(spec.fieldId.value)).expect("No field found")
    const { start, end } = getDateRangeFieldName(field as DateRangeField)

    this.#setDate(start, spec.dateRange.start)
    this.#setDate(end, spec.dateRange.end)
  }
  dateRangeIsEmpty(spec: DateRangeIsEmpty): void {
    const field = this.table.schema.getFieldById(new FieldIdVo(spec.fieldId.value)).expect("No field found")
    const { start, end } = getDateRangeFieldName(field as DateRangeField)

    this.#setDate(start, null)
    this.#setDate(end, null)
  }
  dateRangeDateIsAfter(spec: DateRangeDateIsAfter): void {
    throw new Error("Method not implemented.")
  }
  dateRangeDateIsBefore(spec: DateRangeDateIsBefore): void {
    throw new Error("Method not implemented.")
  }

  dateRangeDateIsSameDay(spec: DateRangeDateIsSameDay): void {
    throw new Error("Method not implemented.")
  }
  dateRangeDateIsToday(spec: DateRangeDateIsToday): void {
    throw new Error("Method not implemented.")
  }
  dateRangeDateIsTomorrow(spec: DateRangeDateIsTomorrow): void {
    throw new Error("Method not implemented.")
  }
  dateRangeDateIsYesterday(spec: DateRangeDateIsYesterday): void {
    throw new Error("Method not implemented.")
  }
  dateRangeDateIsEmpty(spec: DateRangeDateIsEmpty): void {
    throw new Error("Method not implemented.")
  }
  attachmentEqual(s: AttachmentEqual): void {
    this.setData(s.fieldId.value, s.value ? JSON.stringify(s.value) : null)
    if (this.record) {
      const deleteSql = (this.qb as IQueryBuilder)
        .deleteFrom("undb_attachment_mapping")
        .where((eb) =>
          eb.and([
            eb.eb("undb_attachment_mapping.table_id", "=", this.table.id.value),
            eb.eb("undb_attachment_mapping.field_id", "=", s.fieldId.value),
            eb.eb("undb_attachment_mapping.record_id", "=", this.record!.id.value),
          ]),
        )
        .compile()
      this.addSql(deleteSql)

      if (s.value?.length) {
        const userId = this.context.getCurrentUserId()
        const spaceId = this.context.mustGetCurrentSpaceId()
        const insert = (this.qb as IQueryBuilder)
          .insertInto("undb_attachment")
          .values(
            s.value!.map((value) => {
              return {
                size: value.size,
                url: value.url,
                created_at: new Date().getTime(),
                created_by: userId,
                space_id: spaceId,
                id: value.id,
                mime_type: value.type,
                name: value.name,
              }
            }),
          )
          .$if(this.dbProvider.isMysql(), (eb) => eb.ignore())
          .$if(!this.dbProvider.isMysql(), (eb) => eb.onConflict((bd) => bd.columns(["id"]).doNothing()))
          .compile()
        this.addSql(insert)

        const insertSql = (this.qb as IQueryBuilder)
          .insertInto("undb_attachment_mapping")
          .values(
            s.value?.map((value) => ({
              table_id: this.table.id.value,
              field_id: s.fieldId.value,
              record_id: this.record!.id.value,
              attachment_id: value.id,
            })),
          )
          .$if(this.dbProvider.isMysql(), (eb) => eb.ignore())
          .$if(!this.dbProvider.isMysql(), (eb) =>
            eb.onConflict((bd) => bd.columns(["table_id", "field_id", "record_id", "attachment_id"]).doNothing()),
          )
          .compile()
        this.addSql(insertSql)
      }
    }
  }
  longTextEqual(s: LongTextEqual): void {
    this.setData(s.fieldId.value, s.value || null)
  }
  attachmentEmpty(s: AttachmentEmpty): void {
    this.setData(s.fieldId.value, null)
    const deleteSql = (this.qb as IQueryBuilder)
      .deleteFrom("undb_attachment_mapping")
      .where((eb) =>
        eb.and([
          eb.eb("undb_attachment_mapping.table_id", "=", this.table.id.value),
          eb.eb("undb_attachment_mapping.field_id", "=", s.fieldId.value),
          eb.eb("undb_attachment_mapping.record_id", "=", this.record!.id.value),
        ]),
      )
      .compile()
    this.addSql(deleteSql)
  }
  referenceEqual(spec: ReferenceEqual): void {
    const record = this.record
    const field = this.table.schema.getFieldById(spec.fieldId).unwrap() as ReferenceField

    const joinTable = new JoinTable(this.table, field)
    const name = joinTable.getTableName()

    if (!record) {
      const deleteRecords = this.qb.deleteFrom(name).compile()

      this.addSql(deleteRecords)

      const values = spec.values.props

      if (Array.isArray(values) && values.length) {
        const fieldId = joinTable.getValueFieldId()
        const symmetricFieldId = joinTable.getSymmetricValueFieldId()
        const insert = this.qb
          .insertInto(name)
          .columns([fieldId, symmetricFieldId])
          .expression((eb) => {
            const expression = (v: string) =>
              // FIXME: incorrect! should filter by bulk update condition
              eb.selectFrom(this.table.id.value).select([sql.ref(ID_TYPE).as(fieldId), sql.raw(v).as(symmetricFieldId)])

            return values.reduce((prev, value) => prev.unionAll(expression(value)), expression(values[0]))
          })
          .$if(this.dbProvider.isMysql(), (eb) => eb.ignore())
          .$if(!this.dbProvider.isMysql(), (eb) =>
            eb.onConflict((bd) => bd.columns([fieldId, symmetricFieldId]).doNothing()),
          )
          .compile()
        this.addSql(insert)
      }

      return
    }

    const deleteRecords = this.qb
      .deleteFrom(name)
      .where(this.eb.eb(joinTable.getValueFieldId(), "=", record.id.value))
      .compile()

    this.addSql(deleteRecords)

    const values = spec.values.props

    if (Array.isArray(values) && values.length) {
      const fieldId = joinTable.getValueFieldId()
      const symmetricFieldId = joinTable.getSymmetricValueFieldId()
      const insert = this.qb
        .insertInto(name)
        .values(
          values.map((recordId) => ({
            [fieldId]: record.id.value,
            [symmetricFieldId]: recordId,
          })),
        )
        .$if(this.dbProvider.isMysql(), (eb) => eb.ignore())
        .$if(!this.dbProvider.isMysql(), (eb) =>
          eb.onConflict((bd) => bd.columns([fieldId, symmetricFieldId]).doNothing()),
        )
        .compile()
      this.addSql(insert)
    }
  }
  userEqual(spec: UserEqual): void {
    const field = this.table.schema
      .getFieldById(spec.fieldId)
      .expect("No field found: " + spec.fieldId.value) as UserField
    const fieldValue = new UserFieldValue(spec.value)
    const value = fieldValue.getValue(field)

    const convertMacro = (value: string) => {
      if (isUserFieldMacro(value)) {
        if (value === "@me") {
          return this.context.getCurrentUserId()
        }

        return null
      }

      return value
    }

    if (Array.isArray(value)) {
      const converted = unique(value.map(convertMacro).filter(Boolean))
      this.setData(spec.fieldId.value, JSON.stringify(converted))
    } else {
      const converted = value ? convertMacro(value) : null
      this.setData(spec.fieldId.value, converted)
    }
  }
  userEmpty(spec: UserEmpty): void {
    this.setData(spec.fieldId.value, null)
  }
  stringMin(spec: StringMin): void {
    throw new Error("Method not implemented.")
  }
  stringMax(spec: StringMax): void {
    throw new Error("Method not implemented.")
  }
  stringEqual(spec: StringEqual): void {
    this.setData(spec.fieldId.value, spec.values.value || null)
  }
  stringContains(spec: StringContains): void {
    throw new Error("Method not implemented.")
  }
  stringStartsWith(spec: StringStartsWith): void {
    throw new Error("Method not implemented.")
  }
  stringEndsWith(spec: StringEndsWith): void {
    throw new Error("Method not implemented.")
  }
  stringEmpty(spec: StringEmpty): void {
    throw new Error("Method not implemented.")
  }
  percentageEqual(s: PercentageEqual): void {
    this.setData(s.fieldId.value, s.value)
  }
  selectEqual(spec: SelectEqual): void {
    const field = this.table.schema.getFieldById(spec.fieldId).expect("No field found") as SelectField
    const fieldValue = new SelectFieldValue(spec.value)
    const value = fieldValue.getValue(field)

    if (Array.isArray(value)) {
      this.setData(field.id.value, value.length ? JSON.stringify(value) : null)
    } else {
      this.setData(field.id.value, value ?? null)
    }
  }
  selectContainsAnyOf(spec: SelectContainsAnyOf): void {
    throw new Error("Method not implemented.")
  }
  selectEmpty(spec: SelectEmpty): void {
    this.setData(spec.fieldId.value, null)
  }
  durationEqual(s: DurationEqual): void {
    this.setData(s.fieldId.value, s.value || null)
  }
  numberEqual(spec: NumberEqual): void {
    this.setData(spec.fieldId.value, spec.value || null)
  }
  numberGT(spec: NumberGT): void {
    throw new Error("Method not implemented.")
  }
  numberGTE(spec: NumberGTE): void {
    throw new Error("Method not implemented.")
  }
  numberLT(spec: NumberLT): void {
    throw new Error("Method not implemented.")
  }
  numberLTE(spec: NumberLTE): void {
    throw new Error("Method not implemented.")
  }
  numberEmpty(spec: NumberEmpty): void {
    throw new Error("Method not implemented.")
  }
  currencyEqual(spec: CurrencyEqual): void {
    this.setData(spec.fieldId.value, spec.value === null ? null : spec.value * 100)
  }
  currencyGT(s: CurrencyGT): void {
    throw new Error("Method not implemented.")
  }
  currencyGTE(s: CurrencyGTE): void {
    throw new Error("Method not implemented.")
  }
  currencyLT(s: CurrencyLT): void {
    throw new Error("Method not implemented.")
  }
  currencyLTE(s: CurrencyLTE): void {
    throw new Error("Method not implemented.")
  }
  idEqual(spec: IdEqual): void {
    this.setData(spec.fieldId.value, spec.values.value)
  }
  dateIsSameDate(spec: DateIsSameDay): void {
    throw new Error("Method not implemented.")
  }
  dateIsToday(spec: DateIsToday): void {
    throw new Error("Method not implemented.")
  }
  dateIsTomorrow(spec: DateIsTomorrow): void {
    throw new Error("Method not implemented.")
  }
  dateIsYesterday(spec: DateIsTomorrow): void {
    throw new Error("Method not implemented.")
  }
  dateIsBefore(spec: DateIsBefore): void {
    throw new Error("Method not implemented.")
  }
  dateIsAfter(spec: DateIsAfter): void {
    throw new Error("Method not implemented.")
  }
  ratingEqual(s: RatingEqual): void {
    this.setData(s.fieldId.value, s.value || null)
  }
  emailEqual(s: EmailEqual): void {
    this.setData(s.fieldId.value, s.value || null)
  }
  urlEqual(s: UrlEqual): void {
    this.setData(s.fieldId.value, s.value || null)
  }
  clone(): this {
    return new RecordMutateVisitor(this.table, this.record, this.qb, this.eb, this.context, this.dbProvider) as this
  }
  formulaEqual(s: FormulaEqual): void {
    throw new Error("Method not implemented.")
  }
  formulaGT(s: FormulaGT): void {
    throw new Error("Method not implemented.")
  }
  formulaGTE(s: FormulaGTE): void {
    throw new Error("Method not implemented.")
  }
  formulaLT(s: FormulaLT): void {
    throw new Error("Method not implemented.")
  }
  formulaLTE(s: FormulaLTE): void {
    throw new Error("Method not implemented.")
  }
}
