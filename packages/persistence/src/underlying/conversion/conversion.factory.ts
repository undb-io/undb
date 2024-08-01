import type { FieldType } from "@undb/table"
import type { AlterTableBuilder } from "kysely"
import { match } from "ts-pattern"
import type { UnderlyingConversionStrategy } from "./conversion.interface"
import { NoopConversionStrategy } from "./noop.strategy"

export class ConversionFactory {
  public static create(qb: AlterTableBuilder, fromType: FieldType, toType: FieldType): UnderlyingConversionStrategy {
    return match({ fromType, toType }).otherwise(() => new NoopConversionStrategy(qb))
  }
}
