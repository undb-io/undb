import type { Mapper } from "@undb/domain"
import { TableBuilder, type ITableDTO, type TableDo } from "@undb/table"
import type { NewTable, Table } from "../tables"

export class TableMapper implements Mapper<TableDo, NewTable, ITableDTO> {
  public get builder() {
    return new TableBuilder()
  }

  toDo(entity: Table): TableDo {
    return this.builder
      .setId(entity.id)
      .setName(entity.name)
      .setSchema(entity.schema ?? [])
      .setViews(entity.views ?? [])
      .setForms(entity.forms ?? [])
      .setRLS(entity.rls ?? undefined)
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
      rls: entity.rls ?? undefined,
    }
  }
}
