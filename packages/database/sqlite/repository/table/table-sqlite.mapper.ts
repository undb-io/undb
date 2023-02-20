import type {
  ICreateParentFieldInput,
  ICreateRatingFieldInput,
  ICreateSelectFieldSchema,
  ICreateTableSchemaInput,
  ICreateTreeFieldSchema,
  ICreateViewsSchema,
  IParentFieldQuerySchema,
  IQueryFieldSchema,
  IQueryTable,
  IQueryView,
  IRatingFieldQuerySchema,
  ISelectFieldQuerySchema,
  ITreeFieldQuerySchema,
  Table,
} from '@egodb/core'
import { TableFactory } from '@egodb/core'
import type { ICreateReferenceFieldInput, IReferenceFieldQuerySchema } from '@egodb/core/field/reference-field.type.js'
import type { EntityDTO } from '@mikro-orm/core'
import type { Result } from 'oxide.ts'
import type {
  Field as FieldEntity,
  ParentField,
  RatingField,
  ReferenceField,
  SelectField,
  Table as TableEntity,
  TreeField,
} from '../../entity/index.js'

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
    if (entity.type === 'reference') {
      const field = entity as EntityDTO<ReferenceField>
      return {
        id: entity.id,
        name: entity.name,
        type: 'reference',
        foreignTableId: field.foreignTableId,
        displayFieldIds: field.displayFieldIds,
      } satisfies IReferenceFieldQuerySchema
    }
    if (entity.type === 'tree') {
      const field = entity as EntityDTO<TreeField>
      return {
        id: entity.id,
        name: entity.name,
        type: 'tree',
        parentFieldId: field.parentFieldId,
        displayFieldIds: field.displayFieldIds,
      } satisfies ITreeFieldQuerySchema
    }
    if (entity.type === 'parent') {
      const field = entity as EntityDTO<ParentField>
      return {
        id: entity.id,
        name: entity.name,
        type: 'parent',
        treeFieldId: field.treeFieldId,
        displayFieldIds: field.displayFieldIds,
      } satisfies IParentFieldQuerySchema
    }
    if (entity.type === 'rating') {
      const field = entity as EntityDTO<RatingField>
      return {
        id: entity.id,
        name: entity.name,
        type: 'rating',
        max: field.max,
      } satisfies IRatingFieldQuerySchema
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
      viewsOrder: entity.viewsOrder,
      views: entity.views.toArray().map(
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
      schema: entity.fields.toArray().map((f) => {
        if (f.type === 'reference') {
          const field = f as EntityDTO<ReferenceField>
          return {
            id: f.id,
            name: f.name,
            type: 'reference',
            foreignTableId: field.foreignTableId,
            displayFieldIds: field.displayFieldIds,
          } satisfies ICreateReferenceFieldInput
        }
        if (f.type === 'tree') {
          const field = f as EntityDTO<TreeField>
          return {
            id: f.id,
            name: f.name,
            type: 'tree',
            parentFieldId: field.parentFieldId,
            displayFieldIds: field.displayFieldIds,
          } satisfies ICreateTreeFieldSchema
        }
        if (f.type === 'parent') {
          const field = f as EntityDTO<ParentField>
          return {
            id: f.id,
            name: f.name,
            type: 'parent',
            treeFieldId: field.treeFieldId,
            displayFieldIds: field.displayFieldIds,
          } satisfies ICreateParentFieldInput
        }
        if (f.type === 'rating') {
          const field = f as EntityDTO<RatingField>
          return {
            id: f.id,
            name: f.name,
            type: 'rating',
            max: field.max,
          } satisfies ICreateRatingFieldInput
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
    })
  }
}
