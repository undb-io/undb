import { NotImplementException, WontImplementException, type ISpecification, type ISpecVisitor } from "@undb/domain"
import type {
  ITableSpecVisitor,
  TableDo,
  TableIdSpecification,
  TableNameSpecification,
  TableSchemaSpecification,
  TableViewsSpecification,
  WithViewAggregate,
  WithViewColor,
  WithViewFilter,
  WithViewSort,
} from "@undb/table"
import type { WithTableRLS } from "@undb/table/src/specifications/table-rls.specification"
import type { SQLiteUpdateSetSource } from "drizzle-orm/sqlite-core"
import type { tables } from "../tables"

type Source = SQLiteUpdateSetSource<typeof tables>

export class TableMutationVisitor implements ITableSpecVisitor {
  constructor(public readonly table: TableDo) {}
  withViewAggregate(viewColor: WithViewAggregate): void {
    this.#updates = { ...this.#updates, views: this.table.views.toJSON() }
  }
  withTableRLS(rls: WithTableRLS): void {
    throw new NotImplementException(TableMutationVisitor.name + ".withTableRLS")
  }
  withViewSort(viewSort: WithViewSort): void {
    this.#updates = { ...this.#updates, views: this.table.views.toJSON() }
  }
  withViewColor(viewFilter: WithViewColor): void {
    this.#updates = { ...this.#updates, views: this.table.views.toJSON() }
  }

  #updates: Source = {}

  public get updates(): Source {
    return this.#updates
  }

  withId(id: TableIdSpecification): void {
    throw new WontImplementException(TableMutationVisitor.name + ".withId")
  }
  withName(name: TableNameSpecification): void {
    throw new NotImplementException(TableMutationVisitor.name + ".withName")
  }
  withSchema(schema: TableSchemaSpecification): void {
    throw new NotImplementException(TableMutationVisitor.name + ".withSchema")
  }
  withViews(views: TableViewsSpecification): void {
    throw new NotImplementException(TableMutationVisitor.name + ".withSchema")
  }
  withViewFilter(viewFilter: WithViewFilter): void {
    this.#updates = { ...this.#updates, views: this.table.views.toJSON() }
  }
  // TODO: abstraction
  and(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    throw new NotImplementException(TableMutationVisitor.name + ".and")
  }
  or(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    throw new WontImplementException(TableMutationVisitor.name + ".or")
  }
  not(spec: ISpecification<any, ISpecVisitor>): this {
    throw new WontImplementException(TableMutationVisitor.name + ".not")
  }
  clone(): this {
    const visitor = new TableMutationVisitor(this.table)
    return visitor as this
  }
}
