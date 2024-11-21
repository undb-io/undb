import type { IContext } from "@undb/context"
import { NotImplementException } from "@undb/domain"
import {
  CurrencyGT,
  CurrencyGTE,
  CurrencyLT,
  CurrencyLTE,
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
  FormulaEqual,
  FormulaGT,
  FormulaGTE,
  FormulaLT,
  FormulaLTE,
  PercentageEqual,
  SelectField,
  isUserFieldMacro,
  type AttachmentEmpty,
  type AttachmentEqual,
  type CheckboxEqual,
  type CurrencyEqual,
  type DateEqual,
  type DateIsAfter,
  type DateIsBefore,
  type DateIsEmpty,
  type DateIsSameDay,
  type DateIsToday,
  type DateIsTomorrow,
  type EmailEqual,
  type IRecordVisitor,
  type IdEqual,
  type IdIn,
  type JsonContains,
  type JsonEmpty,
  type JsonEqual,
  type LongTextEqual,
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
  type UrlEqual,
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
import { sql, type ExpressionBuilder } from "kysely"
import { isString, unique } from "radash"
import { AbstractQBVisitor } from "../abstract-qb.visitor"
import { getDateRangeFieldName } from "../underlying/underlying-table.util"

export class RecordFilterVisitor extends AbstractQBVisitor<RecordDO> implements IRecordVisitor {
  private getFieldId(spec: RecordComositeSpecification) {
    return this.getTableFieldId(spec.fieldId.value)
  }
  private getTableFieldId(fieldId: string) {
    return `${this.table.id.value}.${fieldId}`
  }
  constructor(
    eb: ExpressionBuilder<any, any>,
    private readonly table: TableDo,
    private readonly context: IContext,
  ) {
    super(eb)
  }
  idIn(spec: IdIn): void {
    this.addCond(this.eb.eb(this.getFieldId(spec), "in", spec.values))
  }
  checkboxEqual(spec: CheckboxEqual): void {
    if (!spec.value) {
      const cond = this.eb.eb(this.getFieldId(spec), "is", null).or(this.getFieldId(spec), "=", false)
      this.addCond(cond)
    } else {
      const cond = this.eb.eb(this.getFieldId(spec), "=", spec.value)
      this.addCond(cond)
    }
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
    if (spec.date === "@now") {
      const now = new Date()
      const start = startOfDay(now).getTime()
      const end = endOfDay(now).getTime()
      const cond = this.eb.between(this.getFieldId(spec), start, end)
      this.addCond(cond)
      return
    } else if (spec.date === "@today") {
      const start = startOfToday().getTime()
      const end = endOfToday().getTime()
      const cond = this.eb.between(this.getFieldId(spec), start, end)
      this.addCond(cond)
      return
    } else if (spec.date === "@yesterday") {
      const start = startOfYesterday().getTime()
      const end = endOfYesterday().getTime()
      const cond = this.eb.between(this.getFieldId(spec), start, end)
      this.addCond(cond)
      return
    } else if (spec.date === "@tomorrow") {
      const start = startOfTomorrow().getTime()
      const end = endOfTomorrow().getTime()
      const cond = this.eb.between(this.getFieldId(spec), start, end)
      this.addCond(cond)
      return
    }

    const time = spec.date?.getTime()
    if (time === null) {
      const cond = this.eb.eb(this.getFieldId(spec), "is", null)
      this.addCond(cond)
    } else {
      const cond = this.eb.eb(this.getFieldId(spec), "=", time)
      this.addCond(cond)
    }
  }
  dateRangeEqual(spec: DateRangeEqual): void {
    throw new Error("Method not implemented.")
  }
  dateRangeIsEmpty(spec: DateRangeIsEmpty): void {
    throw new Error("Method not implemented.")
  }
  dateRangeDateIsAfter(spec: DateRangeDateIsAfter): void {
    const field = this.table.schema.getFieldById(spec.fieldId).expect("Field not found")
    const { start, end } = getDateRangeFieldName(field as DateRangeField)
    const cond = this.eb.eb(
      spec.scope === "start" ? this.getTableFieldId(start) : this.getTableFieldId(end),
      ">=",
      spec.date.getTime(),
    )
    this.addCond(cond)
  }
  dateRangeDateIsBefore(spec: DateRangeDateIsBefore): void {
    const field = this.table.schema.getFieldById(spec.fieldId).expect("Field not found")
    const { start, end } = getDateRangeFieldName(field as DateRangeField)
    const cond = this.eb.eb(
      spec.scope === "start" ? this.getTableFieldId(start) : this.getTableFieldId(end),
      "<=",
      spec.date.getTime(),
    )
    this.addCond(cond)
  }
  dateRangeDateIsSameDay(spec: DateRangeDateIsSameDay): void {
    const field = this.table.schema.getFieldById(spec.fieldId).expect("Field not found")
    const { start, end } = getDateRangeFieldName(field as DateRangeField)
    const cond = this.eb.between(
      spec.scope === "start" ? this.getTableFieldId(start) : this.getTableFieldId(end),
      spec.date.getTime(),
      spec.date.getTime(),
    )
    this.addCond(cond)
  }
  dateRangeDateIsToday(spec: DateRangeDateIsToday): void {
    const field = this.table.schema.getFieldById(spec.fieldId).expect("Field not found")
    const { start, end } = getDateRangeFieldName(field as DateRangeField)
    const cond = this.eb.between(
      spec.scope === "start" ? this.getTableFieldId(start) : this.getTableFieldId(end),
      startOfToday().getTime(),
      endOfToday().getTime(),
    )
    this.addCond(cond)
  }
  dateRangeDateIsEmpty(spec: DateRangeDateIsEmpty): void {
    const field = this.table.schema.getFieldById(spec.fieldId).expect("Field not found")
    const { start, end } = getDateRangeFieldName(field as DateRangeField)
    const cond = this.eb.eb(
      spec.scope === "start" ? this.getTableFieldId(start) : this.getTableFieldId(end),
      "is",
      null,
    )
    this.addCond(cond)
  }
  dateRangeDateIsTomorrow(spec: DateRangeDateIsTomorrow): void {
    const field = this.table.schema.getFieldById(spec.fieldId).expect("Field not found")
    const { start, end } = getDateRangeFieldName(field as DateRangeField)
    const cond = this.eb.between(
      spec.scope === "start" ? this.getTableFieldId(start) : this.getTableFieldId(end),
      startOfTomorrow().getTime(),
      endOfTomorrow().getTime(),
    )
    this.addCond(cond)
  }
  dateRangeDateIsYesterday(spec: DateRangeDateIsYesterday): void {
    const field = this.table.schema.getFieldById(spec.fieldId).expect("Field not found")
    const { start, end } = getDateRangeFieldName(field as DateRangeField)
    const cond = this.eb.between(
      spec.scope === "start" ? this.getTableFieldId(start) : this.getTableFieldId(end),
      startOfYesterday().getTime(),
      endOfYesterday().getTime(),
    )
    this.addCond(cond)
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
      const cond = this.eb.eb(this.getFieldId(spec), "is", null)
      this.addCond(cond)
    } else {
      const convertMacro = (value: string) => {
        if (isUserFieldMacro(value)) {
          if (value === "@me") {
            return this.context.getCurrentUserId()
          }
        }

        return value
      }
      if (Array.isArray(spec.value)) {
        const converted = unique(spec.value.map(convertMacro))
        const cond = this.eb.eb(this.getFieldId(spec), "=", JSON.stringify(converted))
        this.addCond(cond)
      } else {
        if (!spec.value) {
          const cond = this.eb.eb(this.getFieldId(spec), "is", null)
          this.addCond(cond)
        } else {
          const converted = convertMacro(spec.value)
          const cond = this.eb.eb(this.getFieldId(spec), "=", converted)
          this.addCond(cond)
        }
      }
    }
  }
  userEmpty(spec: UserEmpty): void {
    const cond = this.eb.eb(this.getFieldId(spec), "=", "").or(this.getFieldId(spec), "is", null)
    this.addCond(cond)
  }
  currencyEqual(spec: CurrencyEqual): void {
    if (spec.value === null) {
      const cond = this.eb.eb(this.getFieldId(spec), "is", null)
      this.addCond(cond)
    } else {
      const cond = this.eb.eb(this.getFieldId(spec), "=", spec.value * 100)
      this.addCond(cond)
    }
  }
  currencyGT(spec: CurrencyGT): void {
    const cond = this.eb.eb(this.getFieldId(spec), ">", spec.value * 100)
    this.addCond(cond)
  }
  currencyGTE(spec: CurrencyGTE): void {
    const cond = this.eb.eb(this.getFieldId(spec), ">=", spec.value * 100)
    this.addCond(cond)
  }
  currencyLT(spec: CurrencyLT): void {
    const cond = this.eb.eb(this.getFieldId(spec), "<", spec.value * 100)
    this.addCond(cond)
  }
  currencyLTE(spec: CurrencyLTE): void {
    const cond = this.eb.eb(this.getFieldId(spec), "<=", spec.value * 100)
    this.addCond(cond)
  }
  percentageEqual(spec: PercentageEqual): void {
    if (!spec.value) {
      const cond = this.eb.eb(this.getFieldId(spec), "is", null).or(this.getFieldId(spec), "=", 0)
      this.addCond(cond)
    } else {
      const cond = this.eb.eb(this.getFieldId(spec), "=", spec.value)
      this.addCond(cond)
    }
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
    const cond = this.eb.eb(this.getFieldId(spec), "<=", spec.date.getTime())
    this.addCond(cond)
  }
  dateIsAfter(spec: DateIsAfter): void {
    const cond = this.eb.eb(this.getFieldId(spec), ">=", spec.date.getTime())
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
  durationEqual(s: DurationEqual): void {
    const cond = this.eb.eb(this.getFieldId(s), "=", s.value)
    this.addCond(cond)
  }
  selectEqual(spec: SelectEqual): void {
    if (spec.value === null) {
      const cond = this.eb.eb(this.getFieldId(spec), "is", null)
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
    const cond = this.eb.eb(this.getFieldId(spec), "is", null)
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
      const cond = this.eb.exists(
        this.eb
          .selectFrom(sql.raw(`json_each(${this.getFieldId(spec)})`).as("json_each"))
          .select(["1"])
          .where("json_each.value", "in", spec.value),
      )
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
  formulaEqual(spec: FormulaEqual): void {
    const cond = this.eb.eb(this.getFieldId(spec), "=", spec.value)
    this.addCond(cond)
  }
  formulaGT(spec: FormulaGT): void {
    const cond = this.eb.eb(this.getFieldId(spec), ">", spec.value)
    this.addCond(cond)
  }
  formulaGTE(spec: FormulaGTE): void {
    const cond = this.eb.eb(this.getFieldId(spec), ">=", spec.value)
    this.addCond(cond)
  }
  formulaLT(spec: FormulaLT): void {
    const cond = this.eb.eb(this.getFieldId(spec), "<", spec.value)
    this.addCond(cond)
  }
  formulaLTE(spec: FormulaLTE): void {
    const cond = this.eb.eb(this.getFieldId(spec), "<=", spec.value)
    this.addCond(cond)
  }
  clone(): this {
    return new RecordFilterVisitor(this.eb, this.table, this.context) as this
  }
}
