import {
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
  DateRangeIsEmpty,
  DurationEqual,
  FormulaEqual,
  FormulaGT,
  FormulaGTE,
  FormulaLT,
  FormulaLTE,
  JsonContains,
  LongTextEqual,
  PercentageEqual,
  UrlEqual,
  type AttachmentEmpty,
  type AttachmentEqual,
  type CheckboxEqual,
  type CurrencyEqual,
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
import { type QueryCreator } from "kysely"
import type { IRecordQueryBuilder } from "../qb.type"

export class RecordQuerySpecCreatorVisitor implements IRecordVisitor {
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

  percentageEqual(s: PercentageEqual): void {}
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
  dateRangeEqual(spec: DateRangeEqual): void {}
  dateRangeIsEmpty(spec: DateRangeIsEmpty): void {}
  dateRangeDateIsAfter(spec: DateRangeDateIsAfter): void {}
  dateRangeDateIsBefore(spec: DateRangeDateIsBefore): void {}
  dateRangeDateIsEmpty(spec: DateRangeDateIsEmpty): void {}
  dateRangeDateIsSameDay(spec: DateRangeDateIsSameDay): void {}
  dateRangeDateIsToday(spec: DateRangeDateIsToday): void {}
  dateRangeDateIsTomorrow(spec: DateRangeDateIsTomorrow): void {}
  dateRangeDateIsYesterday(spec: DateRangeDateIsYesterday): void {}
  userEqual(spec: UserEqual): void
  userEqual(spec: UserEqual): void {}
  userEmpty(spec: UserEmpty): void
  userEmpty(spec: UserEmpty): void {}
  referenceEqual(spec: ReferenceEqual): void {}
  selectEqual(spec: SelectEqual): void {}
  currencyEqual(s: CurrencyEqual): void {}
  currencyGT(s: CurrencyGT): void {}
  currencyGTE(s: CurrencyGTE): void {}
  currencyLT(s: CurrencyLT): void {}
  currencyLTE(s: CurrencyLTE): void {}
  durationEqual(s: DurationEqual): void {}
  selectContainsAnyOf(spec: SelectContainsAnyOf): void {}
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

  formulaEqual(spec: FormulaEqual): void {}
  formulaGT(spec: FormulaGT): void {}
  formulaGTE(spec: FormulaGTE): void {}
  formulaLT(spec: FormulaLT): void {}
  formulaLTE(spec: FormulaLTE): void {}

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
    spec.accept(this)
    return this
  }
  clone(): this {
    return this
  }
}
