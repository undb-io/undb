import { NotImplementException } from "@undb/domain"
import type {
  AttachmentEmpty,
  AttachmentEqual,
  DateEqual,
  DateIsAfter,
  DateIsBefore,
  DateIsSameDay,
  DateIsToday,
  DateIsTomorrow,
  EmailEqual,
  IRecordVisitor,
  IdEqual,
  NumberEmpty,
  NumberEqual,
  NumberGT,
  NumberGTE,
  NumberLT,
  NumberLTE,
  RatingEqual,
  RecordComositeSpecification,
  RecordDO,
  ReferenceEqual,
  SelectEmpty,
  SelectEqual,
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
import {
  endOfDay,
  endOfToday,
  endOfTomorrow,
  endOfYesterday,
  startOfDay,
  startOfToday,
  startOfTomorrow,
  startOfYesterday,
} from "date-fns"
import type { ExpressionBuilder } from "kysely"
import { AbstractQBVisitor } from "../abstract-qb.visitor"

export class RecordFilterVisitor extends AbstractQBVisitor<RecordDO> implements IRecordVisitor {
  private getFieldId(spec: RecordComositeSpecification) {
    return `${this.table.id.value}.${spec.fieldId.value}`
  }
  constructor(
    eb: ExpressionBuilder<any, any>,
    private readonly table: TableDo,
  ) {
    super(eb)
  }
  dateEqual(spec: DateEqual): void {
    this.addCond(this.eb.eb(this.getFieldId(spec), "=", spec.date.toISOString()))
  }
  attachmentEqual(s: AttachmentEqual): void {
    throw new Error("Method not implemented.")
  }
  attachmentEmpty(s: AttachmentEmpty): void {
    const cond = this.eb
      .eb(this.eb.fn("json_array_length", [this.getFieldId(s)]), "=", 0)
      .or(this.eb.eb(this.getFieldId(s), "is", null))
    this.addCond(cond)
  }

  referenceEqual(spec: ReferenceEqual): void {
    throw new NotImplementException(RecordFilterVisitor.name + ".referenceEqual")
  }
  userEqual(spec: UserEqual): void {
    const cond = this.eb.eb(this.getFieldId(spec), "=", spec.value)
    this.addCond(cond)
  }
  userEmpty(spec: UserEmpty): void {
    const cond = this.eb.eb(this.getFieldId(spec), "=", "").or(this.getFieldId(spec), "is", null)
    this.addCond(cond)
  }
  stringMin(spec: StringMin): void {
    const cond = this.eb.eb(this.eb.fn("LENGTH", [this.getFieldId(spec)]), ">=", spec.min)
    this.addCond(cond)
  }
  stringMax(spec: StringMax): void {
    const cond = this.eb.eb(this.eb.fn("LENGTH", [this.getFieldId(spec)]), "<=", spec.max)
    this.addCond(cond)
  }
  dateIsBefore(spec: DateIsBefore): void {
    const cond = this.eb.eb(this.getFieldId(spec), "<", startOfDay(spec.date).toISOString())
    this.addCond(cond)
  }
  dateIsAfter(spec: DateIsAfter): void {
    const cond = this.eb.eb(this.getFieldId(spec), ">", endOfDay(spec.date).toISOString())
    this.addCond(cond)
  }
  dateIsTomorrow(spec: DateIsTomorrow): void {
    const cond = this.eb.between(this.getFieldId(spec), startOfTomorrow().toISOString(), endOfTomorrow().toISOString())
    this.addCond(cond)
  }
  dateIsYesterday(spec: DateIsTomorrow): void {
    const cond = this.eb.between(
      this.getFieldId(spec),
      startOfYesterday().toISOString(),
      endOfYesterday().toISOString(),
    )
    this.addCond(cond)
  }
  dateIsToday(spec: DateIsToday): void {
    const cond = this.eb.between(this.getFieldId(spec), startOfToday().toISOString(), endOfToday().toISOString())
    this.addCond(cond)
  }
  dateIsSameDate(spec: DateIsSameDay): void {
    const cond = this.eb.between(
      this.getFieldId(spec),
      startOfDay(spec.date).toISOString(),
      endOfDay(spec.date).toISOString(),
    )
    this.addCond(cond)
  }
  idEqual(spec: IdEqual): void {
    const cond = this.eb.eb(this.getFieldId(spec), "=", spec.values.value)
    this.addCond(cond)
  }
  numberEmpty(spec: NumberEmpty): void {
    const cond = this.eb.eb(this.getFieldId(spec), "is", null)
    this.addCond(cond)
  }
  selectEqual(spec: SelectEqual): void {
    const cond = this.eb.eb(this.getFieldId(spec), "=", spec.value)
    this.addCond(cond)
  }
  selectEmpty(spec: SelectEmpty): void {
    const cond = this.eb.eb(this.getFieldId(spec), "=", null)
    this.addCond(cond)
  }
  stringEmpty(spec: StringEmpty): void {
    const cond = this.eb.eb(this.getFieldId(spec), "=", "").or(this.getFieldId(spec), "is", null)
    this.addCond(cond)
  }
  stringStartsWith(spec: StringStartsWith): void {
    const cond = this.eb.eb(this.getFieldId(spec), "like", `${spec.value}%`)
    this.addCond(cond)
  }
  stringEndsWith(spec: StringEndsWith): void {
    const cond = this.eb.eb(this.getFieldId(spec), "like", `%${spec.value}`)
    this.addCond(cond)
  }
  stringContains(spec: StringContains): void {
    const cond = this.eb.eb(this.getFieldId(spec), "like", `%${spec.value}%`)
    this.addCond(cond)
  }
  numberGT(spec: NumberGT): void {
    const cond = this.eb.eb(this.getFieldId(spec), ">", spec.value)
    this.addCond(cond)
  }
  numberGTE(spec: NumberGTE): void {
    const cond = this.eb.eb(this.getFieldId(spec), ">=", spec.value)
    this.addCond(cond)
  }
  numberLT(spec: NumberLT): void {
    const cond = this.eb.eb(this.getFieldId(spec), "<", spec.value)
    this.addCond(cond)
  }
  numberLTE(spec: NumberLTE): void {
    const cond = this.eb.eb(this.getFieldId(spec), "<=", spec.value)
    this.addCond(cond)
  }
  numberEqual(spec: NumberEqual): void {
    const cond = this.eb.eb(this.getFieldId(spec), "=", spec.value)
    this.addCond(cond)
  }
  ratingEqual(s: RatingEqual): void {
    const cond = this.eb.eb(this.getFieldId(s), "=", s.value)
    this.addCond(cond)
  }
  stringEqual(spec: StringEqual): void {
    const cond = this.eb.eb(this.getFieldId(spec), "=", spec.values.value)
    this.addCond(cond)
  }
  emailEqual(s: EmailEqual): void {
    const cond = this.eb.eb(this.getFieldId(s), "=", s.value)
    this.addCond(cond)
  }
  clone(): this {
    return new RecordFilterVisitor(this.eb, this.table) as this
  }
}
