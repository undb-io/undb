import { WontImplementException, type ISpecification, type ISpecVisitor } from "@undb/domain"
import type {
  ITableSpecVisitor,
  SelectField,
  TableBaseIdSpecification,
  TableIdSpecification,
  TableIdsSpecification,
  TableNameSpecification,
  TableSchemaSpecification,
  TableViewsSpecification,
  UserField,
  WithDuplicatedFieldSpecification,
  WithForeignRollupFieldSpec,
  WithNewFieldSpecification,
  WithNewView,
  WithoutFieldSpecification,
  WithoutView,
  WithUpdatedFieldSpecification,
  WithView,
  WithViewAggregate,
  WithViewColor,
  WithViewFields,
  WithViewFilter,
  WithViewIdSpecification,
  WithViewOption,
  WithViewSort,
} from "@undb/table"
import type {
  TableFormsSpecification,
  WithFormIdSpecification,
  WithFormSpecification,
  WithNewFormSpecification,
} from "@undb/table/src/specifications/table-forms.specification"
import type { WithTableRLS } from "@undb/table/src/specifications/table-rls.specification"
import { AlterTableBuilder, AlterTableColumnAlteringBuilder, CompiledQuery, CreateTableBuilder, sql } from "kysely"
import type { IQueryBuilder } from "../qb"
import { ConversionContext } from "./conversion/conversion.context"
import { ConversionFactory } from "./conversion/conversion.factory"
import { JoinTable } from "./reference/join-table"
import type { UnderlyingTable } from "./underlying-table"
import { UnderlyingTableFieldVisitor } from "./underlying-table-field.visitor"

export class UnderlyingTableSpecVisitor implements ITableSpecVisitor {
  private tb: AlterTableBuilder
  constructor(
    public readonly table: UnderlyingTable,
    public readonly qb: IQueryBuilder,
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

  withFormId(spec: WithFormIdSpecification): void {}
  withForeignRollupField(spec: WithForeignRollupFieldSpec): void {}
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
      const strategy = ConversionFactory.create(this.tb as AlterTableBuilder, spec.previous.type, spec.field.type)
      const context = new ConversionContext(strategy)

      context.convert(spec.field)
    } else {
      if (spec.getIsChangeItemSize()) {
        const previous = spec.previous as SelectField | UserField
        const field = spec.field as SelectField | UserField

        if (previous.isSingle) {
          const query = this.qb
            .updateTable(this.table.name)
            .where((eb) => eb.not(eb.or([eb(field.id.value, "is", null), eb(field.id.value, "=", "")])))
            .set((eb) => ({
              [field.id.value]: eb.fn(`json_array`, [sql.raw(field.id.value)]),
            }))
            .compile()

          this.addSql(query)
        } else {
          const query = this.qb
            .updateTable(this.table.name)
            .where((eb) =>
              eb.not(
                eb.or([eb(field.id.value, "is", null), eb(field.id.value, "=", ""), eb(field.id.value, "=", "[]")]),
              ),
            )
            .set((eb) => ({
              [field.id.value]: eb.fn(`json_extract`, [sql.raw(field.id.value), sql.raw("'$[0]'")]),
            }))
            .compile()

          this.addSql(query)
        }
      }
    }
  }
  withViewFields(fields: WithViewFields): void {}
  withForm(views: WithFormSpecification): void {}
  withForms(views: TableFormsSpecification): void {}
  withNewForm(views: WithNewFormSpecification): void {}
  withId(id: TableIdSpecification): void {}
  withName(name: TableNameSpecification): void {}
  withSchema(schema: TableSchemaSpecification): void {}
  withNewField(schema: WithNewFieldSpecification): void {
    const fieldVisitor = new UnderlyingTableFieldVisitor(this.qb, this.table, this.tb)
    schema.field.accept(fieldVisitor)
    this.addSql(...fieldVisitor.sql)
    this.atb = fieldVisitor.atb
  }
  withDuplicateField(schema: WithDuplicatedFieldSpecification): void {
    if (!schema.includeData) {
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
        const query = this.qb.schema.dropTable(joinTable.getTableName()).compile()
        this.addSql(query)
      }
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
