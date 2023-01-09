import type {
  ICreateSelectFieldSchema,
  ICreateTableSchemaInput,
  IQueryFieldSchema,
  IQueryTable,
  ISelectFieldQuerySchema,
} from '@egodb/core'
import { TableFactory } from '@egodb/core'
import type { Field as FieldEntity, Table as TableEntity } from '../../entity'
import { SelectField } from '../../entity'

export class TableSqliteMapper {
  static fieldToQuery(entity: FieldEntity): IQueryFieldSchema {
    if (entity instanceof SelectField) {
      return {
        id: entity.id,
        name: entity.name,
        type: 'select',
        options: entity.options.toArray().map((o) => ({
          id: o.id,
          name: o.name,
          color: {
            name: o.color.name,
            shade: o.color.shade,
          },
        })),
      } satisfies ISelectFieldQuerySchema
    }
    return {
      id: entity.id,
      name: entity.name,
      type: entity.type,
    } as IQueryFieldSchema
  }

  static entityToQuery(entity: TableEntity): IQueryTable {
    return {
      id: entity.id,
      name: entity.name,
      schema: entity.fields.getItems().map((table) => this.fieldToQuery(table)),
      views: entity.views.getItems().map((view) => ({
        id: view.id,
        name: view.name,
        displayType: view.displayType,
        filter: view.filter,
        fieldOptions: view.fieldOptions,
        fieldsOrder: view.fieldsOrder,
        kanban: view.kanban,
        calendar: view.calendar,
      })),
    }
  }

  static entityToDomain(entity: TableEntity) {
    return TableFactory.unsafeCreate({
      id: entity.id,
      name: entity.name,
      schema: entity.fields.getItems().map((f) => {
        if (f instanceof SelectField) {
          return {
            id: f.id,
            name: f.name,
            type: 'select',
            options: f.options.getItems().map((o) => ({
              id: o.id,
              name: o.name,
              color: {
                name: o.color.name,
                shade: o.color.shade,
              },
            })),
          } satisfies ICreateSelectFieldSchema
        }
        return {
          id: f.id,
          name: f.name,
          type: f.type,
        }
      }) as ICreateTableSchemaInput,
      views: entity.views.getItems().map((view) => ({
        id: view.id,
        name: view.name,
        displayType: view.displayType,
        filter: view.filter,
        fieldOptions: view.fieldOptions,
        fieldsOrder: view.fieldsOrder,
        kanban: view.kanban,
        calendar: view.calendar,
      })),
    })
  }
}
