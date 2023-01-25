import type {
  ICreateSelectFieldSchema,
  ICreateTableSchemaInput,
  ICreateViewsSchema,
  IQueryFieldSchema,
  IQueryTable,
  IQueryView,
  ISelectFieldQuerySchema,
  Table,
} from '@egodb/core'
import { TableFactory } from '@egodb/core'
import type { ICreateParentFieldInput } from '@egodb/core/field/parent-field.type'
import type { ICreateTreeFieldInput } from '@egodb/core/field/tree-field.type'
import type { EntityDTO } from '@mikro-orm/core'
import type { Result } from 'oxide.ts'
import type { Field as FieldEntity, ParentField, SelectField, Table as TableEntity, TreeField } from '../../entity'

export class TableSqliteMapper {
  static fieldToQuery(entity: EntityDTO<FieldEntity>): IQueryFieldSchema {
    if (entity.type === 'select') {
      return {
        id: entity.id,
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
            sorts: view.sorts,
          } as IQueryView),
      ),
    }
  }

  static entityToDomain(entity: TableEntity): Result<Table, string> {
    return TableFactory.unsafeCreate({
      id: entity.id,
      name: entity.name,
      schema: entity.fields.toArray().map((f) => {
        if (f.type === 'tree') {
          return {
            id: f.id,
            name: f.name,
            type: 'tree',
            parentFieldId: (f as EntityDTO<TreeField>).parentFieldId,
          } satisfies ICreateTreeFieldInput
        }
        if (f.type === 'parent') {
          return {
            id: f.id,
            name: f.name,
            type: 'parent',
            treeFieldId: (f as EntityDTO<ParentField>).treeFieldId,
          } satisfies ICreateParentFieldInput
        }
        if (f.type === 'select') {
          return {
            id: f.id,
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
        sorts: view.sorts,
      })) as ICreateViewsSchema,
    })
  }
}
