import { injectContext, type IContext } from "@undb/context"
import { singleton } from "@undb/di"
import type { IPagination, Option } from "@undb/domain"
import { FieldIdVo, type Field, type IViewSort, type RecordComositeSpecification, type TableDo } from "@undb/table"
import { sql, type ExpressionBuilder, type SelectQueryBuilder } from "kysely"
import type { ITxContext } from "../ctx.interface"
import { injectTxCTX } from "../ctx.provider"
import { injectQueryBuilder } from "../qb.provider"
import type { IRecordQueryBuilder } from "../qb.type"
import { UnderlyingTable } from "../underlying/underlying-table"
import { RecordQueryCreatorVisitor } from "./record-query-creator-visitor"
import { RecordQuerySpecCreatorVisitor } from "./record-query-spec-creator-visitor"
import { RecordReferenceVisitor } from "./record-reference-visitor"
import { RecordSelectFieldVisitor } from "./record-select-field-visitor"
import { RecordSpecReferenceVisitor } from "./record-spec-reference-visitor"
import { RecordFilterVisitor } from "./record.filter-visitor"

@singleton()
export class RecordQueryHelper {
  constructor(
    @injectQueryBuilder()
    public readonly qb: IRecordQueryBuilder,
    @injectContext()
    private readonly context: IContext,
    @injectTxCTX()
    private readonly txContext: ITxContext,
  ) {}

  createQueryCreator(
    table: TableDo,
    foreignTables: Map<string, TableDo>,
    visibleFields: Field[],
    spec: Option<RecordComositeSpecification>,
  ) {
    const trx = this.txContext.getAnonymousTransaction()

    let qb = new RecordQueryCreatorVisitor(trx, table, foreignTables, visibleFields).create()
    const visitor = new RecordQuerySpecCreatorVisitor(trx, qb, table)
    if (spec.isSome()) {
      spec.unwrap().accept(visitor)
    }
    qb = visitor.creator

    return qb
  }

  createQuery(
    table: TableDo,
    foreignTables: Map<string, TableDo>,
    visibleFields: Field[],
    spec: Option<RecordComositeSpecification>,
  ) {
    const t = new UnderlyingTable(table)
    const qb = this.createQueryCreator(table, foreignTables, visibleFields, spec)

    return qb
      .selectFrom(table.id.value)
      .$call((qb) => new RecordReferenceVisitor(qb, table).join(visibleFields))
      .$call((qb) => {
        const visitor = new RecordSpecReferenceVisitor(qb, table)
        if (spec.isSome()) {
          spec.unwrap().accept(visitor)
        }
        return visitor.join()
      })
      .select((sb) => new RecordSelectFieldVisitor(t, foreignTables, sb).$select(visibleFields))
  }

  handleWhere(table: TableDo, spec: Option<RecordComositeSpecification>) {
    return (eb: ExpressionBuilder<any, any>) => {
      const visitor = new RecordFilterVisitor(eb, table, this.context)
      if (spec?.isSome()) {
        spec.unwrap().accept(visitor)
      }
      return visitor.cond
    }
  }

  handlePagination(pagination: IPagination) {
    return (qb: SelectQueryBuilder<any, any, any>) => {
      const limit = pagination!.limit as number
      return qb.limit(limit).offset(((pagination?.page ?? 1) - 1) * limit)
    }
  }

  handleSort(table: TableDo, sort: IViewSort) {
    return (qb: SelectQueryBuilder<any, any, any>) => {
      return sort!.reduce((qb, s) => {
        const field = table.schema.getFieldById(new FieldIdVo(s.fieldId)).into(undefined)
        if (!field) {
          return qb
        }

        if (field.type === "select") {
          const order = s.direction === "asc" ? field.options : field.options.slice().reverse()
          if (field.isSingle) {
            return qb.orderBy(
              sql.raw(
                `CASE ${table.id.value}.${field.id.value}
                    ${order.map((option, index) => `WHEN '${option.id}' THEN ${index} `).join("\n")}
                    ELSE ${s.direction === "asc" ? -1 : order.length}
                  END`,
              ),
            )
          } else {
            return qb.orderBy(
              sql.raw(
                `CASE json_extract(${table.id.value}.${field.id.value}, '$[0]')
                    ${order.map((option, index) => `WHEN '${option.id}' THEN ${index} `).join("\n")}
                    ELSE ${s.direction === "asc" ? -1 : order.length}
                  END`,
              ),
            )
          }
        }

        return qb.orderBy(`${table.id.value}.${s.fieldId} ${s.direction}`)
      }, qb)
    }
  }
}
