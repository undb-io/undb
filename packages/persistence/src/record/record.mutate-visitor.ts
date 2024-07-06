import type { ISpecification, ISpecVisitor } from "@undb/domain"
import {
  SelectField,
  SelectFieldValue,
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
import type { CompiledQuery, ExpressionBuilder } from "kysely"
import type { IQueryBuilder } from "../qb"
import { JoinTable } from "../underlying/reference/join-table"

export class RecordMutateVisitor implements IRecordVisitor {
  constructor(
    private readonly table: TableDo,
    private readonly record: RecordDO,
    private readonly qb: IQueryBuilder,
    private readonly eb: ExpressionBuilder<any, any>,
  ) {}
  // TODO: data type
  #data: Record<string, any> = {}
  public get data(): Readonly<Record<string, any>> {
    return this.#data
  }

  private setData(key: string, value: any): void {
    this.#data[key] = value
  }

  #sql: CompiledQuery[] = []
  get sql() {
    return this.#sql
  }

  addSql(...sql: CompiledQuery[]) {
    this.#sql.push(...sql)
  }

  idIn(spec: IdIn): void {
    throw new Error("Method not implemented.")
  }
  checkboxEqual(spec: CheckboxEqual): void {
    this.setData(spec.fieldId.value, spec.value)
  }
  jsonEqual(spec: JsonEqual): void {
    this.setData(spec.fieldId.value, JSON.stringify(spec.json))
  }
  jsonEmpty(spec: JsonEmpty): void {
    this.setData(spec.fieldId.value, null)
  }
  dateEqual(spec: DateEqual): void {
    this.setData(spec.fieldId.value, spec.date)
  }
  attachmentEqual(s: AttachmentEqual): void {
    this.setData(s.fieldId.value, JSON.stringify(s.value))
  }
  attachmentEmpty(s: AttachmentEmpty): void {
    this.setData(s.fieldId.value, null)
  }
  referenceEqual(spec: ReferenceEqual): void {
    const field = this.table.schema.getFieldById(spec.fieldId).unwrap() as ReferenceField

    const joinTable = new JoinTable(this.table, field)
    const name = joinTable.getTableName()

    const deleteRecords = this.qb
      .deleteFrom(name)
      .where(this.eb.eb(joinTable.getValueFieldId(), "=", this.record.id.value))
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
            [fieldId]: this.record.id.value,
            [symmetricFieldId]: recordId,
          })),
        )
        .onConflict((bd) => bd.columns([fieldId, symmetricFieldId]).doNothing())
        .compile()
      this.addSql(insert)
    }
  }
  userEqual(spec: UserEqual): void {
    const field = this.table.schema.getFieldById(spec.fieldId).expect("No field found") as UserField
    const fieldValue = new UserFieldValue(spec.value)
    const value = fieldValue.getValue(field)

    this.setData(spec.fieldId.value, Array.isArray(value) ? JSON.stringify(value) : value)
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
    this.setData(spec.fieldId.value, spec.values.value)
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
  selectEqual(spec: SelectEqual): void {
    const field = this.table.schema.getFieldById(spec.fieldId).expect("No field found") as SelectField
    const fieldValue = new SelectFieldValue(spec.value)
    const value = fieldValue.getValue(field)

    this.setData(spec.fieldId.value, Array.isArray(value) ? JSON.stringify(value) : value)
  }
  selectEmpty(spec: SelectEmpty): void {
    this.setData(spec.fieldId.value, null)
  }
  numberEqual(spec: NumberEqual): void {
    this.setData(spec.fieldId.value, spec.value)
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
    this.setData(s.fieldId.value, s.value)
  }
  emailEqual(s: EmailEqual): void {
    this.setData(s.fieldId.value, s.value)
  }
  and(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    left.accept(this)
    right.accept(this)
    return this
  }
  or(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    throw new Error("Method not implemented.")
  }
  not(spec: ISpecification<any, ISpecVisitor>): this {
    throw new Error("Method not implemented.")
  }
  clone(): this {
    throw new Error("Method not implemented.")
  }
}
