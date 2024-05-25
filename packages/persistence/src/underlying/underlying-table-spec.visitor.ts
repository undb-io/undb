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

export class UnderlyingTableSpecVisitor<TB extends CreateTableBuilder<any, any> | AlterTableBuilder>
  implements ITableSpecVisitor
{
  constructor(
    public readonly table: UnderlyingTable,
    public tb: TB,
  ) {}
  withId(id: TableIdSpecification): void {
    throw new Error("Method not implemented.")
  }
  withName(name: TableNameSpecification): void {
    throw new Error("Method not implemented.")
  }
  withSchema(schema: TableSchemaSpecification): void {
    throw new Error("Method not implemented.")
  }
  withNewField(schema: WithNewFieldSpecification): void {
    const fieldVisitor = new UnderlyingTableFieldVisitor(this.table, this.tb)
    schema.field.accept(fieldVisitor)
    this.tb = fieldVisitor.tb
  }
  withTableRLS(rls: WithTableRLS): void {
    throw new Error("Method not implemented.")
  }
  withViews(views: TableViewsSpecification): void {
    throw new Error("Method not implemented.")
  }
  withViewFilter(viewFilter: WithViewFilter): void {
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
  and(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    throw new Error("Method not implemented.")
  }
  or(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    throw new Error("Method not implemented.")
  }
  not(spec: ISpecification<any, ISpecVisitor>): this {
    throw new Error("Method not implemented.")
  }
  clone(): this {
    throw new Error("Method not implemented.")
  }
}
