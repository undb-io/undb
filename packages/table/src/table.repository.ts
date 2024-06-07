import type { Option } from "@undb/domain"
import type { ITableDTO } from "./dto"
import type { TableComositeSpecification } from "./specifications/table.composite-specification"
import type { TableId } from "./table-id.vo"
import type { TableDo } from "./table.do"

export interface ITableRepository {
  insert(table: TableDo): Promise<void>
  updateOneById(table: TableDo, spec: Option<TableComositeSpecification>): Promise<void>
  bulkUpdate(updates: { table: TableDo; spec: Option<TableComositeSpecification> }[]): Promise<void>

  findOneById(id: TableId): Promise<Option<TableDo>>
}

export interface ITableQueryRepository {
  findOneById(id: TableId): Promise<Option<ITableDTO>>
  find(spec: Option<TableComositeSpecification>): Promise<ITableDTO[]>
}
