import type { Field, IFieldAggregate } from "@undb/table"
import { sql, type AliasedExpression, type ExpressionBuilder } from "kysely"
import { match } from "ts-pattern"
import type { UnderlyingTable } from "../underlying/underlying-table"

export class AggregateFnBuiler {
  constructor(
    private readonly table: UnderlyingTable,
    private readonly eb: ExpressionBuilder<any, any>,
    private readonly field: Field,
    private readonly aggregate: IFieldAggregate,
  ) {}

  public build(): AliasedExpression<any, any> {
    const alias = this.field.id.value
    const fieldId = this.table.getFieldName(alias)

    return match(this.aggregate)
      .returnType<AliasedExpression<any, any>>()
      .with("sum", () => this.eb.fn.sum(fieldId).as(alias))
      .with("avg", () => this.eb.fn.avg(fieldId).as(alias))
      .with("min", () => this.eb.fn.min(fieldId).as(alias))
      .with("max", () => this.eb.fn.max(fieldId).as(alias))
      .with("count", () => this.eb.fn.countAll().as(alias))
      .with("count_uniq", () => this.eb.fn.count(fieldId).distinct().as(alias))
      .with("count_empty", () => sql`COUNT(*) - COUNT(NULLIF(${sql.ref(fieldId)}, ''))`.as(alias))
      .with("count_not_empty", () =>
        sql`COUNT(CASE WHEN ${sql.ref(fieldId)} IS NOT NULL AND ${sql.ref(fieldId)} != 0 THEN 1 END)`.as(alias),
      )
      .with("percent_empty", () => sql`(COUNT(*) - COUNT(NULLIF(${sql.ref(fieldId)}, ''))) * 1.0 / COUNT(*)`.as(alias))
      .with("percent_not_empty", () => sql`COUNT(NULLIF(${sql.ref(fieldId)}, '')) * 1.0 / COUNT(*)`.as(alias))
      .with("percent_uniq", () => sql`COUNT(DISTINCT ${sql.ref(fieldId)}) * 1.0 / COUNT(*)`.as(alias))
      .with("count_true", () => sql`COUNT(CASE WHEN ${sql.ref(fieldId)} THEN 1 END)`.as(alias))
      .with("count_false", () => sql`COUNT(CASE WHEN NOT ${sql.ref(fieldId)} THEN 1 END)`.as(alias))
      .with("percent_true", () => sql`COUNT(CASE WHEN ${sql.ref(fieldId)} THEN 1 END) * 1.0 / COUNT(*)`.as(alias))
      .with("percent_false", () => sql`COUNT(CASE WHEN NOT ${sql.ref(fieldId)} THEN 1 END) * 1.0 / COUNT(*)`.as(alias))
      .exhaustive()
  }
}
