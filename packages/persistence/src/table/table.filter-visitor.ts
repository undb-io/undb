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
  WithFormIdSpecification,
  WithFormSpecification,
  WithNewFieldSpecification,
  WithNewFormSpecification,
  WithNewView,
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
  WithoutFieldSpecification,
  WithoutView,
} from "@undb/table"
import { eq, inArray } from "drizzle-orm"
import { AbstractDBFilterVisitor } from "../abstract-db.visitor"
import { tableIdMapping, tables } from "../tables"

export class TableFilterVisitor extends AbstractDBFilterVisitor<TableDo> implements ITableSpecVisitor {
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
    this.qb = this.qb!.leftJoin(tableIdMapping, eq(tableIdMapping.tableId, tables.id))

    this.addCond(eq(tableIdMapping.subjectId, spec.formId))
  }
  withViewId(spec: WithViewIdSpecification): void {
    this.qb = this.qb!.leftJoin(tableIdMapping, eq(tableIdMapping.tableId, tables.id))

    this.addCond(eq(tableIdMapping.subjectId, spec.viewId))
  }
}
