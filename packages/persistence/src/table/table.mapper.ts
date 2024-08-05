import type { Mapper } from "@undb/domain"
import { TableBuilder, type ITableDTO, type TableDo } from "@undb/table"
import type { Table } from "../db"

export class TableMapper implements Mapper<TableDo, Table, ITableDTO> {
  public get builder() {
    return new TableBuilder()
  }

  toDo(entity: Table): TableDo {
    return this.builder
      .setId(entity.id)
      .setName(entity.name)
      .setBaseId(entity.base_id)
      .setSpaceId(entity.space_id)
      .setSchema(entity.schema ?? [])
      .setViews(entity.views ?? [])
      .setForms(entity.forms ?? [])
      .setRLS(entity.rls ?? undefined)
      .build()
  }

  toEntity(domain: TableDo): Table {
    const json = domain.toJSON()
    return {
      id: json.id,
      name: json.name,
      base_id: json.baseId,
      space_id: json.spaceId,
      schema: json.schema ?? [],
      views: json.views,
      forms: json.forms ?? null,
      rls: json.rls ?? null,
    }
  }

  toDTO(entity: Table): ITableDTO {
    return {
      id: entity.id,
      name: entity.name,
      baseId: entity.base_id,
      spaceId: entity.space_id,
      schema: entity.schema ?? [],
      views: entity.views ?? [],
      forms: entity.forms ?? [],
      rls: entity.rls ?? undefined,
    }
  }
}
