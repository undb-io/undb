import { NotImplementException, WontImplementException, type ISpecification, type ISpecVisitor } from "@undb/domain"
import type {
  ITableSpecVisitor,
  TableDo,
  TableIdSpecification,
  TableNameSpecification,
  TableSchemaSpecification,
  TableViewsSpecification,
  WithViewColor,
  WithViewFilter,
} from "@undb/table"
import type { SQLiteUpdateSetSource } from "drizzle-orm/sqlite-core"
import type { tables } from "../tables"

type Source = SQLiteUpdateSetSource<typeof tables>

export class TableMutationVisitor implements ITableSpecVisitor {
  constructor(public readonly table: TableDo) {}
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
    throw new Error("Method not implemented.")
  }
  or(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    throw new Error("Method not implemented.")
  }
  not(spec: ISpecification<any, ISpecVisitor>): this {
    throw new Error("Method not implemented.")
  }
  clone(): this {
    const visitor = new TableMutationVisitor(this.table)
    return visitor as this
  }
}
