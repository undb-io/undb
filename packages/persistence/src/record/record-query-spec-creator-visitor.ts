import {
  DateIsEmpty,
  ID_TYPE,
  JsonContains,
  LongTextEqual,
  UrlEqual,
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
  type RecordComositeSpecification,
  type ReferenceEqual,
  type SelectContainsAnyOf,
  type SelectEmpty,
  type SelectEqual,
  type SelectField,
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
import { sql, type QueryCreator } from "kysely"
import type { IRecordQueryBuilder } from "../qb"

export class RecordQuerySpecCreatorVisitor implements IRecordVisitor {
  private getFieldId(spec: RecordComositeSpecification) {
    return `${this.table.id.value}.${spec.fieldId.value}`
  }
  constructor(
    private readonly qb: IRecordQueryBuilder,
    creator: QueryCreator<any> | undefined,
    private readonly table: TableDo,
  ) {
    this.#creator = creator || null
  }
  #creator: QueryCreator<any> | null = null

  get creator() {
    return this.#creator || this.qb
  }

  longTextEqual(s: LongTextEqual): void {}
  stringEqual(spec: StringEqual): void {}
  stringContains(spec: StringContains): void {}
  stringStartsWith(spec: StringStartsWith): void {}
  stringEndsWith(spec: StringEndsWith): void {}
  stringEmpty(spec: StringEmpty): void {}
  stringMin(spec: StringMin): void {}
  stringMax(spec: StringMax): void {}
  numberEqual(spec: NumberEqual): void {}
  numberGT(spec: NumberGT): void {}
  numberGTE(spec: NumberGTE): void {}
  numberLT(spec: NumberLT): void {}
  numberLTE(spec: NumberLTE): void {}
  numberEmpty(spec: NumberEmpty): void {}
  idEqual(spec: IdEqual): void {}
  idIn(spec: IdIn): void {}
  dateIsSameDate(spec: DateIsSameDay): void {}
  dateIsToday(spec: DateIsToday): void {}
  dateIsTomorrow(spec: DateIsTomorrow): void {}
  dateIsYesterday(spec: DateIsTomorrow): void {}
  dateIsBefore(spec: DateIsBefore): void {}
  dateIsAfter(spec: DateIsAfter): void {}
  userEqual(spec: UserEqual): void
  userEqual(spec: UserEqual): void {}
  userEmpty(spec: UserEmpty): void
  userEmpty(spec: UserEmpty): void {}
  referenceEqual(spec: ReferenceEqual): void {}
  selectEqual(spec: SelectEqual): void {}
  selectContainsAnyOf(spec: SelectContainsAnyOf): void {
    const field = this.table.schema.getFieldById(spec.fieldId).expect("No field found") as SelectField
    if (field.isMultiple) {
      this.#creator = (this.#creator || this.qb).with(spec.fieldId.value, (db) =>
        db
          .selectFrom([this.table.id.value, sql.raw(`json_each(${this.getFieldId(spec)})`).as("json_each")])
          .select([`${this.table.id.value}.${ID_TYPE}`, `json_each.value as ${spec.fieldId.value}`]),
      )
    }
  }
  selectEmpty(spec: SelectEmpty): void {}
  ratingEqual(s: RatingEqual): void {}
  emailEqual(s: EmailEqual): void {}
  urlEqual(s: UrlEqual): void {}
  attachmentEqual(s: AttachmentEqual): void {}
  attachmentEmpty(s: AttachmentEmpty): void {}
  dateIsEmpty(spec: DateIsEmpty): void {}
  dateEqual(spec: DateEqual): void {}
  jsonEqual(spec: JsonEqual): void {}
  jsonContains(spec: JsonContains): void {}
  jsonEmpty(spec: JsonEmpty): void {}
  checkboxEqual(spec: CheckboxEqual): void {}

  and(left: RecordComositeSpecification, right: RecordComositeSpecification): this {
    const lv = this.clone()
    left.accept(lv)

    const rv = this.clone()
    right.accept(rv)

    return this
  }
  or(left: RecordComositeSpecification, right: RecordComositeSpecification): this {
    const lv = this.clone()
    left.accept(lv)

    const rv = this.clone()
    right.accept(rv)

    return this
  }
  not(spec: RecordComositeSpecification): this {
    return this
  }
  clone(): this {
    return this
  }
}
