import type { Field, IFieldAggregate } from "@undb/table"
import { sql, type AliasedExpression, type ExpressionBuilder } from "kysely"
import { match } from "ts-pattern"

export class AggregateFnBuiler {
  constructor(
    private readonly eb: ExpressionBuilder<any, any>,
    private readonly field: Field,
    private readonly aggregate: IFieldAggregate,
  ) {}

  public build(): AliasedExpression<any, any> {
    return match(this.aggregate)
      .returnType<AliasedExpression<any, any>>()
      .with("sum", () => this.eb.fn.sum(this.field.id.value).as(this.field.id.value))
      .with("avg", () => this.eb.fn.avg(this.field.id.value).as(this.field.id.value))
      .with("min", () => this.eb.fn.min(this.field.id.value).as(this.field.id.value))
      .with("max", () => this.eb.fn.max(this.field.id.value).as(this.field.id.value))
      .with("count_uniq", () => this.eb.fn.count(this.field.id.value).distinct().as(this.field.id.value))
      .with("count_empty", () =>
        sql`COUNT(*) - COUNT(NULLIF(${sql.ref(this.field.id.value)}, ''))`.as(this.field.id.value),
      )
      .with("count_not_empty", () =>
        sql`COUNT(CASE WHEN ${sql.ref(this.field.id.value)} IS NOT NULL AND ${sql.ref(this.field.id.value)} != 0 THEN 1 END)`.as(
          this.field.id.value,
        ),
      )
      .with("percent_empty", () =>
        sql`(COUNT(*) - COUNT(NULLIF(${sql.ref(this.field.id.value)}, ''))) * 1.0 / COUNT(*)`.as(this.field.id.value),
      )
      .with("percent_not_empty", () =>
        sql`COUNT(NULLIF(${sql.ref(this.field.id.value)}, '')) * 1.0 / COUNT(*)`.as(this.field.id.value),
      )
      .with("percent_uniq", () =>
        sql`COUNT(DISTINCT ${sql.ref(this.field.id.value)}) * 1.0 / COUNT(*)`.as(this.field.id.value),
      )
      .with("count_true", () =>
        sql`COUNT(CASE WHEN ${sql.ref(this.field.id.value)} THEN 1 END)`.as(this.field.id.value),
      )
      .with("count_false", () =>
        sql`COUNT(CASE WHEN NOT ${sql.ref(this.field.id.value)} THEN 1 END)`.as(this.field.id.value),
      )
      .with("percent_true", () =>
        sql`COUNT(CASE WHEN ${sql.ref(this.field.id.value)} THEN 1 END) * 1.0 / COUNT(*)`.as(this.field.id.value),
      )
      .with("percent_false", () =>
        sql`COUNT(CASE WHEN NOT ${sql.ref(this.field.id.value)} THEN 1 END) * 1.0 / COUNT(*)`.as(this.field.id.value),
      )

      .exhaustive()
  }
}
