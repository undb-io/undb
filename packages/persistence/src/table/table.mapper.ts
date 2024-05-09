import { singleton } from '@undb/di'
import type { Mapper } from '@undb/domain'
import { injectTableBuilder, type ITableBuilder, type ITableDTO, type TableDo } from '@undb/table'
import type { NewTable, Table } from '../tables'

@singleton()
export class TableMapper implements Mapper<TableDo, NewTable, ITableDTO> {
  constructor(
    @injectTableBuilder()
    private readonly builder: ITableBuilder
  ) {}

  toDo(entity: Table): TableDo {
    return this.builder
      .setId(entity.id)
      .setName(entity.name)
      .setSchema(entity.schema ?? [])
      .build()
  }

  toEntity(domain: TableDo): NewTable {
    return {
      id: domain.id.value,
      name: domain.name.value,
      schema: domain.schema.toJSON(),
    }
  }

  toDTO(entity: Table): ITableDTO {
    return {
      id: entity.id,
      name: entity.name,
      schema: entity.schema ?? [],
    }
  }
}
