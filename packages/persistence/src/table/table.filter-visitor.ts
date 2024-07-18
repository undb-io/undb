import { WontImplementException } from "@undb/domain"
import type {
  ITableSpecVisitor,
  TableBaseIdSpecification,
  TableDo,
  TableFormsSpecification,
  TableIdSpecification,
  TableIdsSpecification,
  TableNameSpecification,
  TableSchemaSpecification,
  TableViewsSpecification,
  WithDuplicatedFieldSpecification,
  WithForeignRollupFieldSpec,
  WithFormIdSpecification,
  WithFormSpecification,
  WithNewFieldSpecification,
  WithNewFormSpecification,
  WithNewView,
  WithoutFieldSpecification,
  WithoutView,
  WithTableRLS,
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
import { eq, inArray } from "drizzle-orm"
import type { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core"
import { AbstractDBFilterVisitor } from "../abstract-db.visitor"
import { AbstractQBVisitor } from "../abstract-qb.visitor"
import type { Database } from "../db"
import { rollupIdMapping, tableIdMapping, tables } from "../tables"

export class TableFilterVisitor extends AbstractDBFilterVisitor<TableDo> implements ITableSpecVisitor {
  constructor(
    private readonly db: Database,
    sb: SQLiteSelectQueryBuilder<any, any, any>,
  ) {
    super(sb)
  }
  withBaseId(id: TableBaseIdSpecification): void {
    this.addCond(eq(tables.baseId, id.baseId))
  }
  withNewView(views: WithNewView): void {
    throw new Error("Method not implemented.")
  }
  withoutView(view: WithoutView): void {
    throw new Error("Method not implemented.")
  }
  withView(views: WithView): void {
    throw new Error("Method not implemented.")
  }
  withViewOption(viewOption: WithViewOption): void {
    throw new Error("Method not implemented.")
  }
  withViewFields(fields: WithViewFields): void {
    throw new Error("Method not implemented.")
  }
  withUpdatedField(spec: WithUpdatedFieldSpecification): void {
    throw new Error("Method not implemented.")
  }
  withForm(views: WithFormSpecification): void {
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
  withForms(views: TableFormsSpecification): void {
    throw new Error("Method not implemented.")
  }
  withNewForm(views: WithNewFormSpecification): void {
    throw new Error("Method not implemented.")
  }
  withViewAggregate(viewColor: WithViewAggregate): void {
    throw new Error("Method not implemented.")
  }
  withTableRLS(rls: WithTableRLS): void {
    throw new WontImplementException(TableFilterVisitor.name + ".withTableRLS")
  }
  withViewColor(viewColor: WithViewColor): void {
    throw new WontImplementException(TableFilterVisitor.name + ".withViewColor")
  }
  withViewSort(viewSort: WithViewSort): void {
    throw new WontImplementException(TableFilterVisitor.name + ".withViewSort")
  }
  withViewFilter(viewFilter: WithViewFilter): void {
    throw new WontImplementException(TableFilterVisitor.name + ".withViewFilter")
  }
  withViews(views: TableViewsSpecification): void {
    throw new WontImplementException(TableFilterVisitor.name + ".withViews")
  }
  withId(id: TableIdSpecification): void {
    this.addCond(eq(tables.id, id.id.value))
  }
  idsIn(ids: TableIdsSpecification): void {
    if (!ids.ids.length) return

    this.addCond(
      inArray(
        tables.id,
        ids.ids.map((id) => id.value),
      ),
    )
  }
  withName(name: TableNameSpecification): void {
    this.addCond(eq(tables.name, name.name.value))
  }
  withSchema(schema: TableSchemaSpecification): void {
    throw new WontImplementException(TableFilterVisitor.name + ".withSchema")
  }
  withFormId(spec: WithFormIdSpecification): void {
    this.sb = this.sb!.leftJoin(tableIdMapping, eq(tableIdMapping.tableId, tables.id))

    this.addCond(eq(tableIdMapping.subjectId, spec.formId))
  }
  withViewId(spec: WithViewIdSpecification): void {
    this.sb = this.sb!.leftJoin(tableIdMapping, eq(tableIdMapping.tableId, tables.id))

    this.addCond(eq(tableIdMapping.subjectId, spec.viewId))
  }
  withForeignRollupField(spec: WithForeignRollupFieldSpec): void {
    const subQuery = this.db
      .select({ tableId: rollupIdMapping.rollupTableId })
      .from(rollupIdMapping)
      .where(eq(rollupIdMapping.fieldId, spec.fieldId))

    const cond = inArray(tables.id, subQuery)
    this.addCond(cond)
  }
}

export class TableFilterVisitor2 extends AbstractQBVisitor<TableDo> implements ITableSpecVisitor {
  withId(id: TableIdSpecification): void {
    this.addCond(this.eb.eb(tables.id.name, "=", id.id.value))
  }
  withBaseId(id: TableBaseIdSpecification): void {
    this.addCond(this.eb.eb(tables.baseId.name, "=", id.baseId))
  }
  idsIn(ids: TableIdsSpecification): void {
    if (!ids.ids.length) return

    this.addCond(
      this.eb.eb(
        tables.id.name,
        "in",
        ids.ids.map((id) => id.value),
      ),
    )
  }
  withName(name: TableNameSpecification): void {
    throw new Error("Method not implemented.")
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
    throw new Error("Method not implemented.")
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
  withForms(views: TableFormsSpecification): void {
    throw new Error("Method not implemented.")
  }
  withFormId(spec: WithFormIdSpecification): void {
    throw new Error("Method not implemented.")
  }
  withNewForm(views: WithNewFormSpecification): void {
    throw new Error("Method not implemented.")
  }
  withForm(views: WithFormSpecification): void {
    throw new Error("Method not implemented.")
  }
  withForeignRollupField(spec: WithForeignRollupFieldSpec): void {
    throw new Error("Method not implemented.")
  }
}
