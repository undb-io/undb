import type { ISpecification, ISpecVisitor } from "@undb/domain"
import type {
  ITableSpecVisitor,
  TableIdSpecification,
  TableNameSpecification,
  TableSchemaSpecification,
  TableViewsSpecification,
  WithNewFieldSpecification,
  WithViewAggregate,
  WithViewColor,
  WithViewFilter,
  WithViewSort,
} from "@undb/table"
import type { WithTableRLS } from "@undb/table/src/specifications/table-rls.specification"
import type { AlterTableBuilder, CreateTableBuilder } from "kysely"
import type { UnderlyingTable } from "./underlying-table"
import { UnderlyingTableFieldVisitor } from "./underlying-table-field.visitor"
import type {
  TableFormsSpecification,
  WithNewFormSpecification,
} from "@undb/table/src/specifications/table-forms.specification"

export class UnderlyingTableSpecVisitor<TB extends CreateTableBuilder<any, any> | AlterTableBuilder>
  implements ITableSpecVisitor
{
  constructor(
    public readonly table: UnderlyingTable,
    public tb: TB,
  ) {}
  withForms(views: TableFormsSpecification): void {}
  withNewForm(views: WithNewFormSpecification): void {}
  withId(id: TableIdSpecification): void {}
  withName(name: TableNameSpecification): void {}
  withSchema(schema: TableSchemaSpecification): void {}
  withNewField(schema: WithNewFieldSpecification): void {
    const fieldVisitor = new UnderlyingTableFieldVisitor(this.table, this.tb)
    schema.field.accept(fieldVisitor)
    this.tb = fieldVisitor.tb
  }
  withTableRLS(rls: WithTableRLS): void {}
  withViews(views: TableViewsSpecification): void {}
  withViewFilter(viewFilter: WithViewFilter): void {}
  withViewColor(viewColor: WithViewColor): void {}
  withViewSort(viewSort: WithViewSort): void {}
  withViewAggregate(viewColor: WithViewAggregate): void {}
  and(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    return this
  }
  or(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    return this
  }
  not(spec: ISpecification<any, ISpecVisitor>): this {
    return this
  }
  clone(): this {
    return this
  }
}
