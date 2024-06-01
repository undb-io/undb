import { WontImplementException } from "@undb/domain"
import type {
  ITableSpecVisitor,
  TableDo,
  TableIdSpecification,
  TableNameSpecification,
  TableSchemaSpecification,
  TableViewsSpecification,
  WithNewFieldSpecification,
  WithUpdatedFieldSpecification,
  WithViewAggregate,
  WithViewColor,
  WithViewFilter,
  WithViewSort,
} from "@undb/table"
import type {
  TableFormsSpecification,
  WithFormSpecification,
  WithNewFormSpecification,
} from "@undb/table/src/specifications/table-forms.specification"
import type { WithTableRLS } from "@undb/table/src/specifications/table-rls.specification"
import { eq } from "drizzle-orm"
import { AbstractDBFilterVisitor } from "../abstract-db.visitor"
import { tables } from "../tables"

export class TableFilterVisitor extends AbstractDBFilterVisitor<TableDo> implements ITableSpecVisitor {
  withUpdatedField(spec: WithUpdatedFieldSpecification): void {
    throw new Error("Method not implemented.")
  }
  withForm(views: WithFormSpecification): void {
    throw new Error("Method not implemented.")
  }
  withNewField(schema: WithNewFieldSpecification): void {
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
  withName(name: TableNameSpecification): void {
    this.addCond(eq(tables.name, name.name.value))
  }
  withSchema(schema: TableSchemaSpecification): void {
    throw new WontImplementException(TableFilterVisitor.name + ".withSchema")
  }
}
