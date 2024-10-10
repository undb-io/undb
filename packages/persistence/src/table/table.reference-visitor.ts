import type { ISpecification } from "@undb/domain"
import type {
  DuplicatedTableSpecification,
  ITableSpecVisitor,
  TableBaseIdSpecification,
  TableComositeSpecification,
  TableFormsSpecification,
  TableIdSpecification,
  TableIdsSpecification,
  TableNameSpecification,
  TableSchemaSpecification,
  TableSpaceIdSpecification,
  TableUniqueNameSpecification,
  TableViewsSpecification,
  WithDuplicatedFieldSpecification,
  WithForeignRollupFieldSpec,
  WithFormIdSpecification,
  WithFormSpecification,
  WithNewFieldSpecification,
  WithNewFormSpecification,
  WithNewView,
  WithoutFieldSpecification,
  WithoutFormSpecification,
  WithoutView,
  WithTableForeignTablesSpec,
  WithTableRLS,
  WithUpdatedFieldSpecification,
  WithView,
  WithViewAggregate,
  WithViewColor,
  WithViewFields,
  WithViewFieldWidth,
  WithViewFilter,
  WithViewIdSpecification,
  WithViewOption,
  WithViewSort,
  WithViewWidgets,
} from "@undb/table"
import type { SelectQueryBuilder } from "kysely"
import type { Database, Table } from "../db"

export class TableReferenceVisitor implements ITableSpecVisitor {
  constructor(private sqb: SelectQueryBuilder<Database, "undb_table", Table>) {}

  call(spec: TableComositeSpecification) {
    spec.accept(this)
    return this.sqb
  }

  withId(id: TableIdSpecification): void {}
  withSpaceId(id: TableSpaceIdSpecification): void {}
  withBaseId(id: TableBaseIdSpecification): void {}
  idsIn(ids: TableIdsSpecification): void {}
  withName(name: TableNameSpecification): void {}
  withSchema(schema: TableSchemaSpecification): void {}
  withNewField(schema: WithNewFieldSpecification): void {}
  withDuplicateField(schema: WithDuplicatedFieldSpecification): void {}
  withoutField(schema: WithoutFieldSpecification): void {}
  withUpdatedField(spec: WithUpdatedFieldSpecification): void {}
  withTableRLS(rls: WithTableRLS): void {}
  withViews(views: TableViewsSpecification): void {}
  withView(views: WithView): void {}
  withNewView(views: WithNewView): void {}
  withoutView(view: WithoutView): void {}
  withViewId(spec: WithViewIdSpecification): void {
    this.sqb = this.sqb.leftJoin("undb_table_id_mapping", "undb_table_id_mapping.table_id", "undb_table.id")
  }
  withViewFilter(viewFilter: WithViewFilter): void {}
  withViewOption(viewOption: WithViewOption): void {}
  withViewColor(viewColor: WithViewColor): void {}
  withViewSort(viewSort: WithViewSort): void {}
  withViewAggregate(viewColor: WithViewAggregate): void {}
  withViewFields(fields: WithViewFields): void {}
  withForms(views: TableFormsSpecification): void {}
  withFormId(spec: WithFormIdSpecification): void {
    this.sqb = this.sqb.leftJoin("undb_table_id_mapping", "undb_table_id_mapping.table_id", "undb_table.id")
  }
  withViewFieldWidth(spec: WithViewFieldWidth): void {}
  withNewForm(views: WithNewFormSpecification): void {}
  withoutForm(spec: WithoutFormSpecification): void {}
  withForm(views: WithFormSpecification): void {}
  withForeignRollupField(spec: WithForeignRollupFieldSpec): void {}
  withTableForeignTables(spec: WithTableForeignTablesSpec): void {}
  withViewWidgets(spec: WithViewWidgets): void {}
  withTableUnqueName(spec: TableUniqueNameSpecification): void {
    this.sqb = this.sqb
      .innerJoin("undb_base", "undb_table.base_id", "undb_base.id")
      .where((eb) =>
        eb.and([eb.eb("undb_base.name", "=", spec.baseName), eb.eb("undb_table.name", "=", spec.tableName)]),
      )
  }
  withDuplicatedTable(spec: DuplicatedTableSpecification): void {}
  and(left: ISpecification, right: ISpecification): this {
    left.accept(this)
    right.accept(this)
    return this
  }
  or(left: ISpecification, right: ISpecification): this {
    left.accept(this)
    right.accept(this)
    return this
  }
  not(spec: ISpecification): this {
    spec.accept(this)
    return this
  }
  clone(): this {
    return this
  }
}
