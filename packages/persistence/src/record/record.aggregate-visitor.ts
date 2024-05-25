import type {
  AutoIncrementField,
  CreatedAtField,
  IFieldAggregate,
  IFieldVisitor,
  IdField,
  NumberField,
  StringField,
  UpdatedAtField,
} from "@undb/table"
import { sql, type AliasedExpression, type ExpressionBuilder } from "kysely"
import { match } from "ts-pattern"

export class RecordAggregateVisitor implements IFieldVisitor {
  constructor(
    protected readonly eb: ExpressionBuilder<any, any>,
    private readonly aggregate: IFieldAggregate,
  ) {}

  #ebs: AliasedExpression<any, any>[] = []
  public get ebs() {
    return this.#ebs
  }

  id(field: IdField): void {
    // throw new Error("Method not implemented.")
  }
  autoIncrement(field: AutoIncrementField): void {
    // throw new Error("Method not implemented.")
  }
  createdAt(field: CreatedAtField): void {
    // throw new Error("Method not implemented.")
  }
  updatedAt(field: UpdatedAtField): void {
    // throw new Error("Method not implemented.")
  }
  string(field: StringField): void {
    const aggergate = field.aggregate.parse(this.aggregate)
    const eb = match(aggergate)
      .returnType<AliasedExpression<any, any>>()
      .with("count_uniq", () => this.eb.fn.count(field.id.value).distinct().as(field.id.value))
      .with("count_empty", () => sql`COUNT(*) - COUNT(NULLIF(${sql.ref(field.id.value)}, ''))`.as(field.id.value))
      .with("count_not_empty", () =>
        sql`COUNT(CASE WHEN ${sql.ref(field.id.value)} IS NOT NULL AND ${sql.ref(field.id.value)} != '' THEN 1 END)`.as(
          field.id.value,
        ),
      )
      .with("percent_empty", () =>
        sql`(COUNT(*) - COUNT(NULLIF(${sql.ref(field.id.value)}, ''))) * 1.0 / COUNT(*)`.as(field.id.value),
      )
      .with("percent_not_empty", () =>
        sql`COUNT(NULLIF(${sql.ref(field.id.value)}, '')) * 1.0 / COUNT(*)`.as(field.id.value),
      )
      .with("percent_uniq", () => sql`COUNT(DISTINCT ${sql.ref(field.id.value)}) * 1.0 / COUNT(*)`.as(field.id.value))
      .exhaustive()

    this.#ebs.push(eb)
  }
  number(field: NumberField): void {
    const aggregate = field.aggregate.parse(this.aggregate)
    const eb = match(aggregate)
      .returnType<AliasedExpression<any, any>>()
      .with("sum", () => this.eb.fn.sum(field.id.value).as(field.id.value))
      .with("avg", () => this.eb.fn.avg(field.id.value).as(field.id.value))
      .with("min", () => this.eb.fn.min(field.id.value).as(field.id.value))
      .with("max", () => this.eb.fn.max(field.id.value).as(field.id.value))
      .with("count_uniq", () => this.eb.fn.count(field.id.value).distinct().as(field.id.value))
      .with("count_empty", () => sql`COUNT(*) - COUNT(NULLIF(${sql.ref(field.id.value)}, 0))`.as(field.id.value))
      .with("count_not_empty", () =>
        sql`COUNT(CASE WHEN ${sql.ref(field.id.value)} IS NOT NULL AND ${sql.ref(field.id.value)} != 0 THEN 1 END)`.as(
          field.id.value,
        ),
      )
      .with("percent_empty", () =>
        sql`(COUNT(*) - COUNT(NULLIF(${sql.ref(field.id.value)}, 0))) * 1.0 / COUNT(*)`.as(field.id.value),
      )
      .with("percent_not_empty", () =>
        sql`COUNT(NULLIF(${sql.ref(field.id.value)}, 0)) * 1.0 / COUNT(*)`.as(field.id.value),
      )
      .with("percent_uniq", () => sql`COUNT(DISTINCT ${sql.ref(field.id.value)}) * 1.0 / COUNT(*)`.as(field.id.value))
      .exhaustive()
  }
}
