import type { Option } from "@undb/domain"
import type {
  DuplicatedTableSpecification,
  ITableSpecVisitor,
  TableBaseIdSpecification,
  TableComositeSpecification,
  TableDo,
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
import type { ExpressionBuilder } from "kysely"
import { AbstractQBVisitor } from "../abstract-qb.visitor"
import type { Database } from "../db"
import type { IQueryBuilder } from "../qb.type"

export class TableFilterVisitor extends AbstractQBVisitor<TableDo> implements ITableSpecVisitor {
  constructor(
    private readonly qb: IQueryBuilder,
    protected readonly eb: ExpressionBuilder<Database, "undb_table" | "undb_table_id_mapping">,
    private readonly spaceId: string,
    private readonly ignoreSpace = false,
    cloned = false,
  ) {
    super(eb)
    if (!ignoreSpace && !cloned) {
      this.addCond(this.eb.eb("undb_table.space_id", "=", spaceId))
    }
  }
  $where(spec: Option<TableComositeSpecification>) {
    if (spec.isSome()) {
      spec.unwrap().accept(this)
    }

    return this.cond
  }
  withSpaceId(id: TableSpaceIdSpecification): void {
    this.addCond(this.eb.eb("undb_table.space_id", "=", id.spaceId))
  }
  withId(id: TableIdSpecification): void {
    this.addCond(this.eb.eb("undb_table.id", "=", id.id.value))
  }
  withBaseId(id: TableBaseIdSpecification): void {
    this.addCond(this.eb.eb("undb_table.base_id", "=", id.baseId))
  }
  idsIn(ids: TableIdsSpecification): void {
    if (!ids.ids.length) return

    this.addCond(
      this.eb.eb(
        "id",
        "in",
        ids.ids.map((id) => id.value),
      ),
    )
  }
  withViewFieldWidth(views: WithViewFieldWidth): void {
    throw new Error("Method not implemented.")
  }
  withDuplicatedTable(spec: DuplicatedTableSpecification): void {
    throw new Error("Method not implemented.")
  }
  withName(name: TableNameSpecification): void {
    this.addCond(this.eb.eb("name", "=", name.name.value))
  }
  withSchema(schema: TableSchemaSpecification): void {
    throw new Error("Method not implemented.")
  }
  withNewField(schema: WithNewFieldSpecification): void {
    throw new Error("Method not implemented.")
  }
  withDuplicateField(schema: WithDuplicatedFieldSpecification): void {
    throw new Error("Method not implemented.")
  }
  withoutField(schema: WithoutFieldSpecification): void {
    throw new Error("Method not implemented.")
  }
  withUpdatedField(spec: WithUpdatedFieldSpecification): void {
    throw new Error("Method not implemented.")
  }
  withTableRLS(rls: WithTableRLS): void {
    throw new Error("Method not implemented.")
  }
  withViews(views: TableViewsSpecification): void {
    throw new Error("Method not implemented.")
  }
  withView(views: WithView): void {
    throw new Error("Method not implemented.")
  }
  withNewView(views: WithNewView): void {
    throw new Error("Method not implemented.")
  }
  withoutView(view: WithoutView): void {
    throw new Error("Method not implemented.")
  }
  withViewId(spec: WithViewIdSpecification): void {
    const cond = this.eb.eb("undb_table_id_mapping.subject_id", "=", spec.viewId)
    this.addCond(cond)
  }
  withViewFilter(viewFilter: WithViewFilter): void {
    throw new Error("Method not implemented.")
  }
  withViewOption(viewOption: WithViewOption): void {
    throw new Error("Method not implemented.")
  }
  withViewColor(viewColor: WithViewColor): void {
    throw new Error("Method not implemented.")
  }
  withViewSort(viewSort: WithViewSort): void {
    throw new Error("Method not implemented.")
  }
  withViewAggregate(viewColor: WithViewAggregate): void {
    throw new Error("Method not implemented.")
  }
  withViewFields(fields: WithViewFields): void {
    throw new Error("Method not implemented.")
  }
  withViewWidgets(spec: WithViewWidgets): void {
    throw new Error("Method not implemented.")
  }
  withForms(views: TableFormsSpecification): void {
    throw new Error("Method not implemented.")
  }
  withFormId(spec: WithFormIdSpecification): void {
    const cond = this.eb.eb("undb_table_id_mapping.subject_id", "=", spec.formId)
    this.addCond(cond)
  }
  withNewForm(views: WithNewFormSpecification): void {
    throw new Error("Method not implemented.")
  }
  withoutForm(spec: WithoutFormSpecification): void {
    throw new Error("Method not implemented.")
  }
  withForm(views: WithFormSpecification): void {
    throw new Error("Method not implemented.")
  }
  withForeignRollupField(spec: WithForeignRollupFieldSpec): void {
    const subQuery = this.qb
      .selectFrom("undb_rollup_id_mapping")
      .select(["rollup_table_id"])
      .where((eb) => eb.eb("undb_rollup_id_mapping.field_id", "=", spec.fieldId))
    const cond = this.eb.eb("id", "in", subQuery)
    this.addCond(cond)
  }
  withTableForeignTables(spec: WithTableForeignTablesSpec): void {
    const subQuery = this.qb
      .selectFrom("undb_reference_id_mapping")
      .select(["foreign_table_id"])
      .where((eb) => eb.eb("table_id", "=", spec.tableId.value).or(eb.eb("foreign_table_id", "=", spec.tableId.value)))
    const cond = this.eb.eb("id", "in", subQuery)
    this.addCond(cond)
  }
  withTableUnqueName(spec: TableUniqueNameSpecification): void {}
  clone(): this {
    return new TableFilterVisitor(this.qb, this.eb, this.spaceId, this.ignoreSpace, true) as this
  }
}
