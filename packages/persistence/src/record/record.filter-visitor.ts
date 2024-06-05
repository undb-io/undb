import type {
  DateIsAfter,
  DateIsBefore,
  DateIsSameDay,
  DateIsToday,
  DateIsTomorrow,
  IRecordVisitor,
  IdEqual,
  NumberEmpty,
  NumberEqual,
  NumberGT,
  NumberGTE,
  NumberLT,
  NumberLTE,
  RecordDO,
  StringContains,
  StringEmpty,
  StringEndsWith,
  StringEqual,
  StringMax,
  StringMin,
  StringStartsWith,
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
import { AbstractQBVisitor } from "../abstract-qb.visitor"

export class RecordFilterVisitor extends AbstractQBVisitor<RecordDO> implements IRecordVisitor {
  userEqual(spec: UserEqual): void {
    const cond = this.eb.eb(spec.fieldId.value, "=", spec.value)
    this.addCond(cond)
  }
  userEmpty(spec: UserEmpty): void {
    const cond = this.eb.eb(spec.fieldId.value, "=", "").or(spec.fieldId.value, "is", null)
    this.addCond(cond)
  }
  stringMin(spec: StringMin): void {
    const cond = this.eb.eb(this.eb.fn("LENGTH", [spec.fieldId.value]), ">=", spec.min)
    this.addCond(cond)
  }
  stringMax(spec: StringMax): void {
    const cond = this.eb.eb(this.eb.fn("LENGTH", [spec.fieldId.value]), "<=", spec.max)
    this.addCond(cond)
  }
  dateIsBefore(spec: DateIsBefore): void {
    const cond = this.eb.eb(spec.fieldId.value, "<", startOfDay(spec.date).toISOString())
    this.addCond(cond)
  }
  dateIsAfter(spec: DateIsAfter): void {
    const cond = this.eb.eb(spec.fieldId.value, ">", endOfDay(spec.date).toISOString())
    this.addCond(cond)
  }
  dateIsTomorrow(spec: DateIsTomorrow): void {
    const cond = this.eb.between(spec.fieldId.value, startOfTomorrow().toISOString(), endOfTomorrow().toISOString())
    this.addCond(cond)
  }
  dateIsYesterday(spec: DateIsTomorrow): void {
    const cond = this.eb.between(spec.fieldId.value, startOfYesterday().toISOString(), endOfYesterday().toISOString())
    this.addCond(cond)
  }
  dateIsToday(spec: DateIsToday): void {
    const cond = this.eb.between(spec.fieldId.value, startOfToday().toISOString(), endOfToday().toISOString())
    this.addCond(cond)
  }
  dateIsSameDate(spec: DateIsSameDay): void {
    const cond = this.eb.between(
      spec.fieldId.value,
      startOfDay(spec.date).toISOString(),
      endOfDay(spec.date).toISOString(),
    )
    this.addCond(cond)
  }
  idEqual(spec: IdEqual): void {
    const cond = this.eb.eb(spec.fieldId.value, "=", spec.values.value)
    this.addCond(cond)
  }
  numberEmpty(spec: NumberEmpty): void {
    const cond = this.eb.eb(spec.fieldId.value, "is", null)
    this.addCond(cond)
  }
  stringEmpty(spec: StringEmpty): void {
    const cond = this.eb.eb(spec.fieldId.value, "=", "").or(spec.fieldId.value, "is", null)
    this.addCond(cond)
  }
  stringStartsWith(spec: StringStartsWith): void {
    const cond = this.eb.eb(spec.fieldId.value, "like", `${spec.value}%`)
    this.addCond(cond)
  }
  stringEndsWith(spec: StringEndsWith): void {
    const cond = this.eb.eb(spec.fieldId.value, "like", `%${spec.value}`)
    this.addCond(cond)
  }
  stringContains(spec: StringContains): void {
    const cond = this.eb.eb(spec.fieldId.value, "like", `%${spec.value}%`)
    this.addCond(cond)
  }
  numberGT(spec: NumberGT): void {
    const cond = this.eb.eb(spec.fieldId.value, ">", spec.value)
    this.addCond(cond)
  }
  numberGTE(spec: NumberGTE): void {
    const cond = this.eb.eb(spec.fieldId.value, ">=", spec.value)
    this.addCond(cond)
  }
  numberLT(spec: NumberLT): void {
    const cond = this.eb.eb(spec.fieldId.value, "<", spec.value)
    this.addCond(cond)
  }
  numberLTE(spec: NumberLTE): void {
    const cond = this.eb.eb(spec.fieldId.value, "<=", spec.value)
    this.addCond(cond)
  }
  numberEqual(spec: NumberEqual): void {
    const cond = this.eb.eb(spec.fieldId.value, "=", spec.value)
    this.addCond(cond)
  }
  stringEqual(spec: StringEqual): void {
    const cond = this.eb.eb(spec.fieldId.value, "=", spec.values.value)
    this.addCond(cond)
  }
}
