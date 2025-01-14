import type { IContext } from "@undb/context"
import { WontImplementException, type ISpecification, type ISpecVisitor } from "@undb/domain"
import {
  CREATED_AT_TYPE,
  CREATED_BY_TYPE,
  ReferenceField,
  UPDATED_AT_TYPE,
  UPDATED_BY_TYPE,
  WithViewFieldWidth,
  WithViewWidgets,
  type DuplicatedTableSpecification,
  type ITableSpecVisitor,
  type SelectField,
  type TableBaseIdSpecification,
  type TableDo,
  type TableIdSpecification,
  type TableIdsSpecification,
  type TableNameSpecification,
  type TableSchemaSpecification,
  type TableSpaceIdSpecification,
  type TableUniqueNameSpecification,
  type TableViewsSpecification,
  type UserField,
  type WithDuplicatedFieldSpecification,
  type WithForeignRollupFieldSpec,
  type WithNewFieldSpecification,
  type WithNewView,
  type WithoutFieldSpecification,
  type WithoutView,
  type WithTableForeignTablesSpec,
  type WithUpdatedFieldSpecification,
  type WithView,
  type WithViewAggregate,
  type WithViewColor,
  type WithViewFields,
  type WithViewFilter,
  type WithViewIdSpecification,
  type WithViewOption,
  type WithViewSort,
} from "@undb/table"
import type {
  TableFormsSpecification,
  WithFormIdSpecification,
  WithFormSpecification,
  WithNewFormSpecification,
  WithoutFormSpecification,
} from "@undb/table/src/specifications/table-forms.specification"
import type { WithTableRLS } from "@undb/table/src/specifications/table-rls.specification"
import { AlterTableBuilder, AlterTableColumnAlteringBuilder, CompiledQuery, CreateTableBuilder, sql } from "kysely"
import type { IDbProvider } from "../db.provider"
import type { IRecordQueryBuilder } from "../qb.type"
import type { IDatabaseFnUtil } from "../utils/fn.util"
import { ConversionContext } from "./conversion/conversion.context"
import { ConversionFactory } from "./conversion/conversion.factory"
import { JoinTable } from "./reference/join-table"
import { UnderlyingTable } from "./underlying-table"
import { UnderlyingTableFieldUpdatedVisitor } from "./underlying-table-field-updated.visitor"
import { UnderlyingTableFieldVisitor } from "./underlying-table-field.visitor"

export class UnderlyingTableSpecVisitor implements ITableSpecVisitor {
  private tb: AlterTableBuilder
  constructor(
    public readonly table: UnderlyingTable,
    public readonly qb: IRecordQueryBuilder,
    public readonly context: IContext,
    private readonly dbProvider: IDbProvider,
    private readonly dbFnUtil: IDatabaseFnUtil,
  ) {
    this.tb = qb.schema.alterTable(table.name)
  }
  atb: AlterTableColumnAlteringBuilder | CreateTableBuilder<any, any> | null = null

  async execute() {
    await this.atb?.execute()
    for (const query of this.sql) {
      await this.qb.executeQuery(query)
    }
  }

  #sql: CompiledQuery[] = []
  get sql() {
    return this.#sql
  }
  addSql(...sql: CompiledQuery[]) {
    this.#sql.push(...sql)
  }

  withSpaceId(id: TableSpaceIdSpecification): void {}
  withFormId(spec: WithFormIdSpecification): void {}
  withForeignRollupField(spec: WithForeignRollupFieldSpec): void {}
  withTableForeignTables(spec: WithTableForeignTablesSpec): void {}
  withBaseId(id: TableBaseIdSpecification): void {}
  idsIn(ids: TableIdsSpecification): void {}
  withNewView(views: WithNewView): void {}
  withoutView(view: WithoutView): void {}
  withViewId(spec: WithViewIdSpecification): void {}
  withView(views: WithView): void {}
  withViewOption(viewOption: WithViewOption): void {}
  withUpdatedField(spec: WithUpdatedFieldSpecification): void {
    const typeChanged = spec.getIsTypeChanged()
    if (typeChanged) {
      const previousField = spec.previous
      const field = spec.field
      const strategy = ConversionFactory.create(
        this.tb as AlterTableBuilder,
        this.qb,
        this.table.table,
        previousField,
        field,
      )
      const context = new ConversionContext(strategy)

      const sql = context.convert(field, previousField)
      this.addSql(...sql)
    }

    if (spec.getIsChangeItemSize()) {
      const previous = spec.previous as SelectField | UserField
      const field = spec.field as SelectField | UserField

      if (previous.isSingle) {
        const query = this.qb
          .updateTable(this.table.name)
          .where((eb) => eb.not(eb.or([eb(field.id.value, "is", null), eb(field.id.value, "=", "")])))
          .set((eb) => ({
            [field.id.value]: eb.fn(this.dbFnUtil.jsonArray, [sql.raw(`${this.table.name}."${field.id.value}"`)]),
          }))
          .compile()

        this.addSql(query)
      } else {
        const query = this.qb
          .updateTable(this.table.name)
          .where((eb) =>
            eb.not(eb.or([eb(field.id.value, "is", null), eb(field.id.value, "=", ""), eb(field.id.value, "=", "[]")])),
          )
          .set((eb) => ({
            [field.id.value]: eb.fn(`json_extract`, [sql.raw(field.id.value), sql.raw("'$[0]'")]),
          }))
          .compile()

        this.addSql(query)
      }

      const fieldVisitor = new UnderlyingTableFieldUpdatedVisitor(
        this.qb,
        this.table,
        spec.previous,
        this.tb,
        this.dbFnUtil,
      )
      spec.field.accept(fieldVisitor)
      this.addSql(...fieldVisitor.sql)
    }
  }
  withDuplicatedTable(spec: DuplicatedTableSpecification): void {
    if (!spec.includeData) {
      return
    }

    const { originalTable, duplicatedTable } = spec
    // TODO: virtual fields common util
    const getColumns = (table: TableDo) => {
      return table.schema.fields
        .filter((f) => f.type !== "reference" && f.type !== "rollup")
        .filter((f) => {
          if (spec.isSameSpace) {
            return true
          }

          return f.type !== "user" && f.type !== "attachment"
        })
        .map((f) => f.id.value)
    }

    const duplicateDataSql = this.qb
      .insertInto(duplicatedTable.id.value)
      .columns(getColumns(duplicatedTable))
      .expression((eb) => eb.selectFrom(originalTable.id.value).select(getColumns(originalTable)))
      .compile()

    this.addSql(duplicateDataSql)

    const userId = this.context.getCurrentUserId()
    const updateSql = this.qb
      .updateTable(duplicatedTable.id.value)
      .set((eb) => ({
        [UPDATED_AT_TYPE]: new Date().getTime(),
        [CREATED_AT_TYPE]: new Date().getTime(),
        [UPDATED_BY_TYPE]: userId,
        [CREATED_BY_TYPE]: userId,
      }))
      .compile()
    this.addSql(updateSql)

    const referenceFields = duplicatedTable.schema.getReferenceFields()

    for (const field of referenceFields) {
      if (!field.isOwner) continue

      const joinTable = new JoinTable(duplicatedTable, field)
      const originalField = originalTable.schema.fields.find((f) => f.id.value === field.id.value)
      if (!(originalField instanceof ReferenceField)) continue

      const originalJoinTable = new JoinTable(originalTable, originalField)
      const duplicateReferenceSql = this.qb
        .insertInto(joinTable.getTableName())
        .columns([joinTable.getValueFieldId(), joinTable.getSymmetricValueFieldId()])
        .expression((eb) =>
          eb
            .selectFrom(originalJoinTable.getTableName())
            .select([originalJoinTable.getValueFieldId(), originalJoinTable.getSymmetricValueFieldId()]),
        )
        .compile()

      this.addSql(duplicateReferenceSql)
    }
  }
  withViewFields(fields: WithViewFields): void {}
  withViewFieldWidth(spec: WithViewFieldWidth): void {}
  withViewWidgets(spec: WithViewWidgets): void {}
  withForm(views: WithFormSpecification): void {}
  withForms(views: TableFormsSpecification): void {}
  withNewForm(views: WithNewFormSpecification): void {}
  withoutForm(spec: WithoutFormSpecification): void {}
  withId(id: TableIdSpecification): void {}
  withName(name: TableNameSpecification): void {}
  withSchema(schema: TableSchemaSpecification): void {}
  withNewField(schema: WithNewFieldSpecification): void {
    const fieldVisitor = new UnderlyingTableFieldVisitor(this.qb, this.table, this.tb, this.dbProvider, false)
    schema.field.accept(fieldVisitor)
    this.addSql(...fieldVisitor.sql)
    this.atb = fieldVisitor.atb
  }
  withDuplicateField(schema: WithDuplicatedFieldSpecification): void {
    if (!schema.includeData) {
      return
    }

    if (schema.field.type === "button") {
      return
    }

    if (schema.field.type !== "reference") {
      const query = this.qb
        .updateTable(this.table.name)
        .set((eb) => ({
          [schema.field.id.value]: eb.ref(schema.originalField.id.value),
        }))
        .compile()
      this.addSql(query)
    } else {
      const { originalField, field } = schema
      if (originalField.type !== "reference") {
        throw new Error("Not implemented to duplicate reference when original field is not reference")
      }
      const joinTable = new JoinTable(this.table.table, field)
      const originalJoinTable = new JoinTable(this.table.table, originalField)

      const query = this.qb
        .insertInto(joinTable.getTableName())
        .columns([joinTable.getValueFieldId(), joinTable.getSymmetricValueFieldId()])
        .expression((eb) =>
          eb
            .selectFrom(originalJoinTable.getTableName())
            .select((eb) => [originalJoinTable.getValueFieldId(), originalJoinTable.getSymmetricValueFieldId()]),
        )
        .compile()

      this.addSql(query)
    }
  }
  withoutField(schema: WithoutFieldSpecification): void {
    if (schema.field.type === "reference") {
      const field = schema.field
      if (field.isOwner) {
        const joinTable = new JoinTable(this.table.table, field)
        const query = this.qb.schema.dropTable(joinTable.getTableName()).ifExists().compile()
        this.addSql(query)
      }
      return
    }

    if (schema.field.type === "button") {
      return
    }

    if (schema.field.type !== "rollup") {
      const query = this.tb.dropColumn(schema.field.id.value).compile()
      this.addSql(query)
    }
  }
  withTableRLS(rls: WithTableRLS): void {}
  withViews(views: TableViewsSpecification): void {}
  withViewFilter(viewFilter: WithViewFilter): void {}
  withViewColor(viewColor: WithViewColor): void {}
  withViewSort(viewSort: WithViewSort): void {}
  withViewAggregate(viewColor: WithViewAggregate): void {}
  withTableUnqueName(spec: TableUniqueNameSpecification): void {}
  and(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    left.accept(this)
    right.accept(this)
    return this
  }
  or(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    throw new WontImplementException(UnderlyingTableSpecVisitor.name + ".or")
  }
  not(spec: ISpecification<any, ISpecVisitor>): this {
    throw new WontImplementException(UnderlyingTableSpecVisitor.name + ".not")
  }
  clone(): this {
    return this
  }
}
