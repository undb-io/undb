import type { IQueryFieldSchema, IQueryTable } from '@egodb/core'
import type { EntityDTO } from '@mikro-orm/core'
import type { Field as FieldEntity, Table as TableEntity } from '../../entity'
import { fieldEnumMap } from '../../entity'

export class TableSqliteMapper {
  static fieldToQuery(entity: EntityDTO<FieldEntity>): IQueryFieldSchema {
    return {
      id: entity.id,
      name: entity.name,
      type: fieldEnumMap[entity.type],
    } as IQueryFieldSchema
  }

  static entityToQuery(entity: TableEntity): IQueryTable {
    return {
      id: entity.id,
      name: entity.name,
      schema: entity.fields.toArray().map((table) => this.fieldToQuery(table)),
    }
  }
}
