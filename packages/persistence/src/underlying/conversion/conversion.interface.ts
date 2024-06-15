import type { Field } from "@undb/table"
import type { AlterTableBuilder } from "kysely"

export abstract class UnderlyingConversionStrategy implements IConversionStrategy {
  constructor(public qb: AlterTableBuilder) {}
  abstract convert(field: Field): void | Promise<void>
}

export interface IConversionStrategy {
  convert(field: Field): void | Promise<void>
}
