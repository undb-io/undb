import { ID_TYPE, type Field, type IFieldAggregate } from "@undb/table"
import { sql, type AliasedExpression, type ExpressionBuilder } from "kysely"
import { match } from "ts-pattern"
import type { UnderlyingTable } from "../underlying/underlying-table"
import { getDateRangeFieldName } from "../underlying/underlying-table.util"

export class AggregateFnBuiler {
  constructor(
    private readonly table: UnderlyingTable,
    private readonly eb: ExpressionBuilder<any, any>,
    private readonly field: Field | undefined,
    private readonly aggregate: IFieldAggregate,
  ) {}

  public build(): AliasedExpression<any, any> {
    const field = this.field
    const aggregate = this.aggregate
    const alias = field?.id.value ?? ID_TYPE
    if (!field && aggregate === "count") {
      return sql`COUNT(*)`.as(alias)
    }
    if (!field) {
      throw new Error("Field is required for aggregate")
    }
    const fieldId = this.table.getFieldName(alias)

    const getRef = (field: Field) => {
      if (field.type === "reference") {
        return this.table.getFieldName(ID_TYPE)
      }
      if (field.type === "rollup") {
        return `${field.getReferenceField(this.table.table).id.value}.${field.id.value}`
      }
      if (field.type === "dateRange") {
        const { start } = getDateRangeFieldName(field)
        return this.table.getFieldName(start)
      }
      return this.table.getFieldName(field.id.value)
    }

    return match(aggregate)
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
            ? sql`ROUND(COALESCE(AVG(${sql.ref(getRef(field))}) / 100.0, 0), 2)`
            : sql`COALESCE(AVG(${sql.ref(getRef(field))}), 0)`
        return expr.as(alias)
      })
      .with("min", () => {
        const expr = match(field.type)
          .with("currency", () => sql`COALESCE(MIN(${sql.ref(getRef(field))}) / 100.0, 0)`)
          .otherwise(() => sql`COALESCE(MIN(${sql.ref(getRef(field))}), 0)`)
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
          return sql`COUNT(
                        CASE
                            WHEN ${sql.ref(getRef(field))} NOT IN (SELECT ${sql.raw(ID_TYPE)} FROM ${sql.ref(field.id.value)})
                            THEN 1
                        END
                    )`.as(alias)
        }
        if (field.type === "dateRange") {
          const { start, end } = getDateRangeFieldName(field)
          return sql`COUNT(
            CASE
              WHEN ${sql.ref(this.table.getFieldName(start))} IS NULL AND ${sql.ref(this.table.getFieldName(end))} IS NULL
              THEN 1
            END
          )`.as(alias)
        }
        return sql`COUNT(*) - COUNT(NULLIF(${sql.ref(getRef(field))}, ''))`.as(alias)
      })
      .with("count_not_empty", () => {
        if (field.type === "reference") {
          return sql`COUNT(
                        CASE
                            WHEN ${sql.ref(getRef(field))} IN (SELECT ${sql.raw(ID_TYPE)} FROM ${sql.ref(field.id.value)})
                            THEN 1
                        END
                    )`.as(alias)
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
      .with("start_max", () => {
        if (field.type !== "dateRange") {
          throw new Error("start_max is only supported for dateRange field")
        }
        const { start } = getDateRangeFieldName(field)
        return sql`MAX(${sql.ref(this.table.getFieldName(start))})`.as(alias)
      })
      .with("end_max", () => {
        if (field.type !== "dateRange") {
          throw new Error("end_max is only supported for dateRange field")
        }
        const { end } = getDateRangeFieldName(field)
        return sql`MAX(${sql.ref(this.table.getFieldName(end))})`.as(alias)
      })
      .with("start_min", () => {
        if (field.type !== "dateRange") {
          throw new Error("start_min is only supported for dateRange field")
        }
        const { start } = getDateRangeFieldName(field)
        return sql`MIN(${sql.ref(this.table.getFieldName(start))})`.as(alias)
      })
      .with("end_min", () => {
        if (field.type !== "dateRange") {
          throw new Error("end_min is only supported for dateRange field")
        }
        const { end } = getDateRangeFieldName(field)
        return sql`MIN(${sql.ref(this.table.getFieldName(end))})`.as(alias)
      })
      .exhaustive()
  }
}
