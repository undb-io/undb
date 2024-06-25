import type { ISpecification, ISpecVisitor } from "@undb/domain"
import type {
  DateIsAfter,
  DateIsBefore,
  DateIsSameDay,
  DateIsToday,
  DateIsTomorrow,
  IdEqual,
  IRecordVisitor,
  NumberEmpty,
  NumberEqual,
  NumberGT,
  NumberGTE,
  NumberLT,
  NumberLTE,
  RecordDO,
  ReferenceEqual,
  ReferenceField,
  StringContains,
  StringEmpty,
  StringEndsWith,
  StringEqual,
  StringMax,
  StringMin,
  StringStartsWith,
  TableDo,
  UserEmpty,
  UserEqual,
} from "@undb/table"
import type { RatingEqual } from "@undb/table/src/modules/schema/fields/variants/rating-field/rating-field.specification"
import type {
  SelectEmpty,
  SelectEqual,
} from "@undb/table/src/modules/schema/fields/variants/select-field/select-field-specification"
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
    this.setData(spec.fieldId.value, spec.value)
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
    this.setData(spec.fieldId.value, spec.value)
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
    throw new Error("Method not implemented.")
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
