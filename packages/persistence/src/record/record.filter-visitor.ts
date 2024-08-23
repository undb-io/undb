import { NotImplementException } from "@undb/domain"
import {
  DateIsEmpty,
  JsonContains,
  LongTextEqual,
  SelectField,
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
  type IRecordVisitor,
  type IdEqual,
  type IdIn,
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
  type RecordDO,
  type ReferenceEqual,
  type SelectContainsAnyOf,
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
import { isString } from "radash"
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
  idIn(spec: IdIn): void {
    this.addCond(this.eb.eb(this.getFieldId(spec), "in", spec.values))
  }
  checkboxEqual(spec: CheckboxEqual): void {
    const cond = this.eb.eb(this.getFieldId(spec), "=", spec.value)
    this.addCond(cond)
  }
  longTextEqual(spec: LongTextEqual): void {
    const cond = this.eb.eb(this.getFieldId(spec), "=", spec.value)
    this.addCond(cond)
  }
  jsonEqual(spec: JsonEqual): void {
    const json = isString(spec.json) ? spec.json : JSON.stringify(spec.json)
    const cond = this.eb.eb(this.getFieldId(spec), "=", json)
    this.addCond(cond)
  }
  jsonContains(spec: JsonContains): void {
    const cond = this.eb.eb(this.getFieldId(spec), "like", `%${spec.value}%`)
    this.addCond(cond)
  }
  jsonEmpty(spec: JsonEmpty): void {
    this.addCond(this.eb.eb(this.getFieldId(spec), "is", null))
  }
  dateIsEmpty(spec: DateIsEmpty): void {
    const cond = this.eb.eb(this.getFieldId(spec), "is", null)
    this.addCond(cond)
  }
  dateEqual(spec: DateEqual): void {
    this.addCond(this.eb.eb(this.getFieldId(spec), "=", spec.date?.getTime() ?? null))
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
    if (spec.value === null) {
      const cond = this.eb.eb(this.getFieldId(spec), "=", null)
      this.addCond(cond)
    } else {
      const cond = this.eb.eb(
        this.getFieldId(spec),
        "=",
        isString(spec.value) ? spec.value : JSON.stringify(spec.value),
      )
      this.addCond(cond)
    }
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
    const cond = this.eb.eb(this.getFieldId(spec), "<", startOfDay(spec.date).getTime())
    this.addCond(cond)
  }
  dateIsAfter(spec: DateIsAfter): void {
    const cond = this.eb.eb(this.getFieldId(spec), ">", endOfDay(spec.date).getTime())
    this.addCond(cond)
  }
  dateIsTomorrow(spec: DateIsTomorrow): void {
    const cond = this.eb.between(this.getFieldId(spec), startOfTomorrow().getTime(), endOfTomorrow().getTime())
    this.addCond(cond)
  }
  dateIsYesterday(spec: DateIsTomorrow): void {
    const cond = this.eb.between(this.getFieldId(spec), startOfYesterday().getTime(), endOfYesterday().getTime())
    this.addCond(cond)
  }
  dateIsToday(spec: DateIsToday): void {
    const cond = this.eb.between(this.getFieldId(spec), startOfToday().getTime(), endOfToday().getTime())
    this.addCond(cond)
  }
  dateIsSameDate(spec: DateIsSameDay): void {
    const cond = this.eb.between(this.getFieldId(spec), startOfDay(spec.date).getTime(), endOfDay(spec.date).getTime())
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
    if (spec.value === null) {
      const cond = this.eb.eb(this.getFieldId(spec), "=", null)
      this.addCond(cond)
    } else {
      const cond = this.eb.eb(
        this.getFieldId(spec),
        "=",
        isString(spec.value) ? spec.value : JSON.stringify(spec.value),
      )
      this.addCond(cond)
    }
  }
  selectEmpty(spec: SelectEmpty): void {
    const cond = this.eb.eb(this.getFieldId(spec), "=", null)
    this.addCond(cond)
  }
  selectContainsAnyOf(spec: SelectContainsAnyOf): void {
    const field = this.table.schema.getFieldById(spec.fieldId).unwrap()
    if (!(field instanceof SelectField)) {
      return
    }

    if (field.isSingle) {
      const cond = this.eb.eb(this.getFieldId(spec), "in", spec.value)
      this.addCond(cond)
    } else {
      const cond = this.eb.eb(`${spec.fieldId.value}.${spec.fieldId.value}`, "in", spec.value)
      this.addCond(cond)
    }
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
  urlEqual(s: UrlEqual): void {
    const cond = this.eb.eb(this.getFieldId(s), "=", s.value)
    this.addCond(cond)
  }
  clone(): this {
    return new RecordFilterVisitor(this.eb, this.table) as this
  }
}
