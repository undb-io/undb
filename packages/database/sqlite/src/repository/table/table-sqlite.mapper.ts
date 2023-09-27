import type { ICreateViewsSchema, IQueryTable, IQueryView, Table } from '@undb/core'
import { TableFactory, TableSchema } from '@undb/core'
import type { Result } from 'oxide.ts'
import type { Table as TableEntity } from '../../entity/index.js'

export class TableSqliteMapper {
  static entityToQuery(entity: TableEntity): IQueryTable {
    return {
      id: entity.id,
      name: entity.name,
      emoji: entity.emoji,
      baseId: entity.base?.id,
      schema: entity.fields.getItems(false).map((field) => field.toQuery()),
      viewsOrder: entity.viewsOrder,
      forms: entity.forms.getItems(false).map((form) => ({
        id: form.id,
        name: form.name,
        fields: form.fields,
        fieldsOrder: form.fieldsOrder,
      })),
      views: entity.views.getItems(false).map(
        (view) =>
          ({
            id: view.id,
            name: view.name,
            displayType: view.displayType,
            showSystemFields: view.showSystemFields,
            filter: view.filter,
            fieldOptions: view.fieldOptions,
            fieldsOrder: view.fieldsOrder,
            kanban: view.kanban,
            gallery: view.gallery,
            gantt: view.gantt,
            tree: view.tree,
            calendar: view.calendar,
            sorts: view.sorts,
            pinnedFields: view.pinnedFields,
            rowHeight: view.rowHeight,
            dashboard: {
              widgets: view.widgets.isInitialized()
                ? view.widgets.getItems(false).map((widget) => widget.toQuery())
                : [],
            },
          }) as IQueryView,
      ),
    }
  }

  static entityToDomain(entity: TableEntity): Result<Table, string> {
    return TableFactory.unsafeCreate({
      id: entity.id,
      name: entity.name,
      schema: [],
      emoji: entity.emoji,
      baseId: entity.base?.id,
      forms: entity.forms.getItems(false).map((form) => ({
        id: form.id,
        name: form.name,
        fields: form.fields,
        fieldsOrder: form.fieldsOrder,
      })),
      views: entity.views.isInitialized()
        ? (entity.views.getItems(false).map((view) => ({
            id: view.id,
            name: view.name,
            displayType: view.displayType,
            showSystemFields: view.showSystemFields,
            filter: view.filter,
            fieldOptions: view.fieldOptions,
            fieldsOrder: view.fieldsOrder,
            kanban: view.kanban,
            gallery: view.gallery,
            gantt: view.gantt,
            tree: view.tree,
            calendar: view.calendar,
            sorts: view.sorts,
            pinnedFields: view.pinnedFields,
            rowHeight: view.rowHeight,
            dashboard: {
              widgets: view.widgets.isInitialized()
                ? view.widgets.getItems(false).map((widget) => widget.toQuery())
                : [],
            },
          })) as ICreateViewsSchema)
        : [],
      viewsOrder: entity.viewsOrder,
    }).map((table) => {
      table.schema = new TableSchema(entity.fields.getItems(false).map((field) => field.toDomain()))
      return table
    })
  }
}
