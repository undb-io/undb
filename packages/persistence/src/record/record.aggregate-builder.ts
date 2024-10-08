import { None, Some, type Option } from "@undb/domain"
import { ID_TYPE, type Field, type IFieldAggregate } from "@undb/table"
import { sql, type AliasedExpression, type Expression, type ExpressionBuilder } from "kysely"
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
    const field = this.field
    const alias = field.id.value
    const fieldId = this.table.getFieldName(alias)

    const getRef = (field: Field) => {
      if (field.type === "rollup") {
        return `${field.getReferenceField(this.table.table).id.value}.${field.id.value}`
      }
      return this.table.getFieldName(field.id.value)
    }

    return match(this.aggregate)
      .returnType<AliasedExpression<any, any>>()
      .with("sum", () => {
        const expr =
          field.type === "currency"
            ? sql`COALESCE(SUM(${sql.ref(getRef(field))}) / 100.0, 0)`
            : sql`COALESCE(SUM(${sql.ref(getRef(field))}), 0)`
        return expr.as(alias)
      })
      .with("avg", () => {
        const expr =
          field.type === "currency"
            ? sql`COALESCE(AVG(${sql.ref(getRef(field))}) / 100.0, 0)`
            : sql`COALESCE(AVG(${sql.ref(getRef(field))}), 0)`
        return expr.as(alias)
      })
      .with("min", () => {
        const expr =
          field.type === "currency"
            ? sql`COALESCE(MIN(${sql.ref(getRef(field))}) / 100.0, 0)`
            : sql`COALESCE(MIN(${sql.ref(getRef(field))}), 0)`
        return expr.as(alias)
      })
      .with("max", () => {
        const expr =
          field.type === "currency"
            ? sql`COALESCE(MAX(${sql.ref(getRef(field))}) / 100.0, 0)`
            : sql`COALESCE(MAX(${sql.ref(getRef(field))}), 0)`
        return expr.as(alias)
      })
      .with("count", () => sql`COUNT(*)`.as(alias))
      .with("count_uniq", () => sql`COUNT(DISTINCT ${sql.ref(fieldId)})`.as(alias))
      .with("count_empty", () => {
        if (field.type === "reference") {
          return sql`COUNT(*)`.as(alias)
        }
        return sql`COUNT(*) - COUNT(NULLIF(${sql.ref(getRef(field))}, ''))`.as(alias)
      })
      .with("count_not_empty", () => {
        if (field.type === "reference") {
          return sql`COUNT(*)`.as(alias)
        }
        return sql`COUNT(CASE WHEN ${sql.ref(getRef(field))} IS NOT NULL AND ${sql.ref(getRef(field))} != 0 THEN 1 END)`.as(
          alias,
        )
      })
      .with("percent_empty", () => sql`(COUNT(*) - COUNT(NULLIF(${sql.ref(fieldId)}, ''))) * 1.0 / COUNT(*)`.as(alias))
      .with("percent_not_empty", () => sql`COUNT(NULLIF(${sql.ref(fieldId)}, '')) * 1.0 / COUNT(*)`.as(alias))
      .with("percent_uniq", () => sql`COUNT(DISTINCT ${sql.ref(fieldId)}) * 1.0 / COUNT(*)`.as(alias))
      .with("count_true", () => sql`COUNT(CASE WHEN ${sql.ref(fieldId)} THEN 1 END)`.as(alias))
      .with("count_false", () => sql`COUNT(CASE WHEN NOT ${sql.ref(fieldId)} THEN 1 END)`.as(alias))
      .with("percent_true", () => sql`COUNT(CASE WHEN ${sql.ref(fieldId)} THEN 1 END) * 1.0 / COUNT(*)`.as(alias))
      .with("percent_false", () => sql`COUNT(CASE WHEN NOT ${sql.ref(fieldId)} THEN 1 END) * 1.0 / COUNT(*)`.as(alias))
      .exhaustive()
  }

  public handleWhere(): Option<Expression<any>> {
    return match(this.field.type)
      .returnType<Option<Expression<any>>>()
      .with("reference", () =>
        match(this.aggregate)
          .returnType<Option<Expression<any>>>()
          .with("count_not_empty", () => {
            const expr = this.eb(
              this.table.getFieldName(ID_TYPE),
              "in",
              this.eb.selectFrom(this.field.id.value).select(ID_TYPE),
            )
            return Some(expr)
          })
          .with("count_empty", () => {
            const expr = this.eb(
              this.table.getFieldName(ID_TYPE),
              "not in",
              this.eb.selectFrom(this.field.id.value).select(ID_TYPE),
            )
            return Some(expr)
          })
          .otherwise(() => None),
      )
      .otherwise(() => None)
  }
}
