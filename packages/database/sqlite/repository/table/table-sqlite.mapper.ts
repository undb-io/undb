import type { ICreateViewsSchema, IQueryTable, IQueryView, Table } from '@egodb/core'
import { TableFactory, TableSchema } from '@egodb/core'
import type { Result } from 'oxide.ts'
import type { Table as TableEntity } from '../../entity/index.js'

export class TableSqliteMapper {
  static entityToQuery(entity: TableEntity): IQueryTable {
    return {
      id: entity.id,
      name: entity.name,
      schema: entity.fields.getItems().map((field) => field.toQuery()),
      viewsOrder: entity.viewsOrder,
      views: entity.views.getItems().map(
        (view) =>
          ({
            id: view.id,
            name: view.name,
            displayType: view.displayType,
            filter: view.filter,
            fieldOptions: view.fieldOptions,
            fieldsOrder: view.fieldsOrder,
            kanban: view.kanban,
            tree: view.tree,
            calendar: view.calendar,
            sorts: view.sorts,
          } as IQueryView),
      ),
    }
  }

  static entityToDomain(entity: TableEntity): Result<Table, string> {
    return TableFactory.unsafeCreate({
      id: entity.id,
      name: entity.name,
      schema: [],
      views: entity.views.toArray().map((view) => ({
        id: view.id,
        name: view.name,
        displayType: view.displayType,
        filter: view.filter,
        fieldOptions: view.fieldOptions,
        fieldsOrder: view.fieldsOrder,
        kanban: view.kanban,
        tree: view.tree,
        calendar: view.calendar,
        sorts: view.sorts,
      })) as ICreateViewsSchema,
      viewsOrder: entity.viewsOrder,
    }).map((table) => {
      table.schema = new TableSchema(entity.fields.getItems().map((field) => field.toDomain()))
      return table
    })
  }
}
