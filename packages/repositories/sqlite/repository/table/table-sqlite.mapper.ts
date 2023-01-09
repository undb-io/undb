import type { ICreateTableSchemaInput, IQueryFieldSchema, IQueryTable } from '@egodb/core'
import { TableFactory } from '@egodb/core'
import type { EntityDTO } from '@mikro-orm/core'
import type { Field as FieldEntity, Table as TableEntity } from '../../entity'

export class TableSqliteMapper {
  static fieldToQuery(entity: EntityDTO<FieldEntity>): IQueryFieldSchema {
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
    }
  }

  static entityToDomain(entity: TableEntity) {
    return TableFactory.unsafeCreate({
      id: entity.id,
      name: entity.name,
      schema: entity.fields.toJSON().map((f) => ({
        id: f.id,
        name: f.name,
        type: f.type,
      })) as ICreateTableSchemaInput,
    })
  }
}
