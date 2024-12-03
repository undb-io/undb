import type { Field, TableDo } from "@undb/table"
import { AlterTableBuilder, CaseWhenBuilder, sql, type ColumnDataType } from "kysely"
import { match } from "ts-pattern"
import type { IRecordQueryBuilder } from "../../../qb.type"
import { TEMP_FIELD_PREFIX } from "../conversion.constant"
import { UnderlyingConversionStrategy } from "../conversion.interface"

export class AnyToNumberStrategy extends UnderlyingConversionStrategy {
  constructor(
    tb: AlterTableBuilder,
    qb: IRecordQueryBuilder,
    table: TableDo,
    private readonly previous: Field,
    private readonly field: Field,
  ) {
    super(tb, qb, table)
  }
  private getType(): ColumnDataType {
    if (this.field.type === "rating") {
      return "integer"
    }
    return "real"
  }

  get toMax(): number | undefined {
    const field = this.field
    return match(field)
      .with({ type: "rating" }, { type: "number" }, { type: "percentage" }, { type: "duration" }, (field) => field.max)
      .with({ type: "currency" }, (field) => (field.max ? field.max / 100 : undefined))
      .otherwise(() => undefined)
  }

  get toMin(): number | undefined {
    const field = this.field
    return match(field)
      .with({ type: "rating" }, { type: "number" }, { type: "percentage" }, { type: "duration" }, (field) => field.min)
      .with({ type: "currency" }, (field) => (field.min ? field.min / 100 : undefined))
      .otherwise(() => undefined)
  }

  convert(field: Field): void | Promise<void> {
    const tempField = TEMP_FIELD_PREFIX + field.id.value
    const fieldId = field.id.value
    const type = this.getType()
    const previousType = this.previous.type

    this.changeType(field, type, () =>
      this.qb
        .updateTable(this.table.id.value)
        .set((eb) => {
          const max = this.toMax
          const min = this.toMin
          let builder: CaseWhenBuilder<any, any, any, any> = eb
            .case()
            .when(fieldId, "is", null)
            .then(sql`NULL`)
            .when(fieldId, "=", "")
            .then(sql`NULL`)
          if (max) {
            builder = builder.when(fieldId, ">", max).then(max)
          }
          if (min) {
            builder = builder.when(fieldId, "<", min).then(min)
          }
          return {
            [tempField]: builder
              .else(previousType === "currency" ? sql.raw(`CAST(${fieldId} / 100 AS real)`) : eb.cast(fieldId, type))
              .end(),
          }
        })
        .compile(),
    )
  }
}
