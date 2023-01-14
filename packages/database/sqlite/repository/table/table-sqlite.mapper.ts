import type {
  ICreateSelectFieldSchema,
  ICreateTableSchemaInput,
  ICreateViewsSchema,
  IQueryFieldSchema,
  IQueryTable,
  IQueryView,
  ISelectFieldQuerySchema,
} from '@egodb/core'
import { TableFactory } from '@egodb/core'
import type { EntityDTO } from '@mikro-orm/core'
import type { Field as FieldEntity, SelectField, Table as TableEntity } from '../../entity'

export class TableSqliteMapper {
  static fieldToQuery(entity: EntityDTO<FieldEntity>): IQueryFieldSchema {
    if (entity.type === 'select') {
      return {
        id: entity.id,
        key: entity.key,
        name: entity.name,
        type: 'select',
        options: (entity as EntityDTO<SelectField>).options.map((o) => ({
          key: o.key,
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
      key: entity.key,
      name: entity.name,
      type: entity.type,
    } as IQueryFieldSchema
  }

  static entityToQuery(entity: TableEntity): IQueryTable {
    return {
      id: entity.id,
      name: entity.name,
      schema: entity.fields.toArray().map((table) => this.fieldToQuery(table)),
      views: entity.views.toArray().map(
        (view) =>
          ({
            key: view.key,
            name: view.name,
            displayType: view.displayType,
            filter: view.filter,
            fieldOptions: view.fieldOptions,
            fieldsOrder: view.fieldsOrder,
            kanban: view.kanban,
            calendar: view.calendar,
          } as IQueryView),
      ),
    }
  }

  static entityToDomain(entity: TableEntity) {
    return TableFactory.unsafeCreate({
      id: entity.id,
      name: entity.name,
      schema: entity.fields.toArray().map((f) => {
        if (f.type === 'select') {
          return {
            id: f.id,
            key: f.key,
            name: f.name,
            type: 'select',
            options: (f as EntityDTO<SelectField>).options.map((o) => ({
              key: o.key,
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
          key: f.key,
          name: f.name,
          type: f.type,
        }
      }) as ICreateTableSchemaInput,
      views: entity.views.toArray().map((view) => ({
        id: view.id,
        key: view.key,
        name: view.name,
        displayType: view.displayType,
        filter: view.filter,
        fieldOptions: view.fieldOptions,
        fieldsOrder: view.fieldsOrder,
        kanban: view.kanban,
        calendar: view.calendar,
      })) as ICreateViewsSchema,
    })
  }
}
