import type { Field, FieldType, TableDo } from "@undb/table"
import type { AlterTableBuilder } from "kysely"
import { match } from "ts-pattern"
import type { IRecordQueryBuilder } from "../../qb.server.ts"
import type { UnderlyingConversionStrategy } from "./conversion.interface"
import { NoopConversionStrategy } from "./noop.strategy"
import { AnyToCurrencyStrategy } from "./strategies/any-to-currency.strategy"
import { AnyToDateRangeStrategy } from "./strategies/any-to-date-range.strategy.ts"
import { AnyToEmailStrategy } from "./strategies/any-to-email.strategy"
import { AnyToNumberStrategy } from "./strategies/any-to-number.strategy"
import { AnyToTextStrategy } from "./strategies/any-to-text.strategy"
import { AnyToUrlStrategy } from "./strategies/any-to-url.strategy"
import { ClearValueStrategy } from "./strategies/clear-value.strategy"
import { DateToDateRangeStrategy } from "./strategies/date-to-date-range.strategy"
import { NumberToBooleanStrategy } from "./strategies/number-to-boolean.strategy"
import { NumberToDateRangeStrategy } from "./strategies/number-to-date-range.strategy.ts"
import { NumberToDateStrategy } from "./strategies/number-to-date.strategy"
import { SelectToStringStrategy } from "./strategies/select-to-string.strategy"
import { StringToBooleanStrategy } from "./strategies/string-to-boolean.strategy"
import { StringToDateRangeStrategy } from "./strategies/string-to-date-range.strategy"
import { StringToDateStrategy } from "./strategies/string-to-date.strategy"
import { StringToSelectStrategy } from "./strategies/string-to-select.strategy"
import { StringToUserStrategy } from "./strategies/string-to-user.strategy"
import { UserToStringStrategy } from "./strategies/user-to-string.strategy"

function isNumberTypeField(type: FieldType): type is "number" | "rating" | "duration" | "percentage" {
  return ["number", "rating", "duration", "percentage"].includes(type)
}

function isTextTypeField(type: FieldType): type is "string" | "longText" {
  return ["string", "longText"].includes(type)
}

export class ConversionFactory {
  public static create(
    tb: AlterTableBuilder,
    qb: IRecordQueryBuilder,
    table: TableDo,
    fromField: Field,
    toField: Field,
  ): UnderlyingConversionStrategy {
    const fromType = fromField.type
    const toType = toField.type
    return (
      match({ fromType, toType })
        // text to text
        .when(
          ({ fromType, toType }) => isTextTypeField(fromType) && isTextTypeField(toType),
          () => new NoopConversionStrategy(tb, qb, table),
        )
        .with({ toType: "email" }, () => new AnyToEmailStrategy(tb, qb, table))
        .with({ toType: "url" }, () => new AnyToUrlStrategy(tb, qb, table))

        // date-range
        .with({ fromType: "date", toType: "dateRange" }, () => new DateToDateRangeStrategy(tb, qb, table))
        .when(
          ({ fromType, toType }) => isTextTypeField(fromType) && toType === "dateRange",
          () => new StringToDateRangeStrategy(tb, qb, table),
        )
        .when(
          ({ fromType, toType }) => fromType === "number" && toType === "dateRange",
          () => new NumberToDateRangeStrategy(tb, qb, table),
        )
        .with({ toType: "dateRange" }, () => new AnyToDateRangeStrategy(tb, qb, table))

        // user
        .when(
          ({ fromType, toType }) => isTextTypeField(fromType) && toType === "user",
          () => new StringToUserStrategy(tb, qb, table),
        )
        .when(
          ({ fromType, toType }) => fromType === "user" && isTextTypeField(toType),
          () => new UserToStringStrategy(tb, qb, table),
        )

        // select
        .when(
          ({ fromType, toType }) => isTextTypeField(fromType) && toType === "select",
          () => new StringToSelectStrategy(tb, qb, table),
        )
        .when(
          ({ fromType, toType }) => fromType === "select" && isTextTypeField(toType),
          () => new SelectToStringStrategy(tb, qb, table),
        )

        // date
        .when(
          ({ fromType, toType }) => isTextTypeField(fromType) && toType === "date",
          () => new StringToDateStrategy(tb, qb, table),
        )
        .when(
          ({ fromType, toType }) => isNumberTypeField(fromType) && toType === "date",
          () => new NumberToDateStrategy(tb, qb, table),
        )

        // checkbox
        .when(
          ({ fromType, toType }) => isTextTypeField(fromType) && toType === "checkbox",
          () => new StringToBooleanStrategy(tb, qb, table),
        )
        .when(
          ({ fromType, toType }) => isNumberTypeField(fromType) && toType === "checkbox",
          () => new NumberToBooleanStrategy(tb, qb, table),
        )

        // number
        .when(
          ({ toType }) => isNumberTypeField(toType),
          () => new AnyToNumberStrategy(tb, qb, table, fromField, toField),
        )

        // currency
        .with({ toType: "currency" }, () => new AnyToCurrencyStrategy(tb, qb, table))

        // text
        .when(
          ({ toType }) => isTextTypeField(toType),
          () => new AnyToTextStrategy(tb, qb, table),
        )
        .otherwise(() => new ClearValueStrategy(tb, qb, table))
    )
  }
}
