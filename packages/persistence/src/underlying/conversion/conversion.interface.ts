import type { Field, TableDo } from "@undb/table"
import type { AlterTableBuilder, ColumnDataType, CompiledQuery } from "kysely"
import type { IRecordQueryBuilder } from "../../qb.type"
import { TEMP_FIELD_PREFIX } from "./conversion.constant"

export abstract class UnderlyingConversionStrategy implements IConversionStrategy {
  constructor(
    public tb: AlterTableBuilder,
    public readonly qb: IRecordQueryBuilder,
    public readonly table: TableDo,
  ) {}
  #sql: CompiledQuery[] = []

  addSql(...sql: CompiledQuery[]) {
    this.#sql.push(...sql)
  }

  getSql() {
    return this.#sql
  }

  abstract convert(field: Field, previousField: Field): void | Promise<void>

  generateTempFieldId(name: string) {
    return TEMP_FIELD_PREFIX + name
  }

  tempField(field: Field) {
    return this.generateTempFieldId(field.id.value)
  }

  protected changeType(field: Field, type: ColumnDataType, update: () => CompiledQuery) {
    const tempField = this.tempField(field)
    const addColumn = this.tb.addColumn(tempField, type).compile()
    const updated = update()
    const dropColumn = this.tb.dropColumn(field.id.value).compile()
    const renameColumn = this.tb.renameColumn(tempField, field.id.value).compile()

    this.addSql(addColumn, updated, dropColumn, renameColumn)
  }
}

export interface IConversionStrategy {
  convert(field: Field, previousField: Field): void | Promise<void>
}
