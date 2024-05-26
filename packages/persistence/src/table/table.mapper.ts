import { singleton } from "@undb/di"
import type { Mapper } from "@undb/domain"
import { injectTableBuilder, type ITableBuilder, type ITableDTO, type TableDo } from "@undb/table"
import type { NewTable, Table } from "../tables"

@singleton()
export class TableMapper implements Mapper<TableDo, NewTable, ITableDTO> {
  constructor(
    @injectTableBuilder()
    private readonly builder: ITableBuilder,
  ) {}

  toDo(entity: Table): TableDo {
    return this.builder
      .setId(entity.id)
      .setName(entity.name)
      .setSchema(entity.schema ?? [])
      .setViews(entity.views ?? [])
      .setForms(entity.forms ?? [])
      .build()
  }

  toEntity(domain: TableDo): NewTable {
    return domain.toJSON()
  }

  toDTO(entity: Table): ITableDTO {
    return {
      id: entity.id,
      name: entity.name,
      schema: entity.schema ?? [],
      views: entity.views ?? [],
      forms: entity.forms ?? [],
    }
  }
}
