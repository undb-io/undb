import type { Option } from "@undb/domain"
import type { ITableDTO } from "./dto"
import type { TableComositeSpecification } from "./specifications/table.composite-specification"
import type { TableId } from "./table-id.vo"
import type { TableDo } from "./table.do"

export interface ITableRepository {
  insert(table: TableDo): Promise<void>
  insertMany(tables: TableDo[]): Promise<void>
  updateOneById(table: TableDo, spec: Option<TableComositeSpecification>): Promise<void>
  bulkUpdate(updates: { table: TableDo; spec: Option<TableComositeSpecification> }[]): Promise<void>

  deleteOneById(table: TableDo): Promise<void>

  find(spec: Option<TableComositeSpecification>, ignoreSpace?: boolean): Promise<TableDo[]>
  findOne(spec: Option<TableComositeSpecification>): Promise<Option<TableDo>>
  findOneById(id: TableId): Promise<Option<TableDo>>
  findManyByIds(ids: TableId[]): Promise<TableDo[]>
}

export interface ITableQueryRepository {
  findOneById(id: TableId): Promise<Option<ITableDTO>>
  findOne(spec: TableComositeSpecification): Promise<Option<ITableDTO>>
  find(spec: Option<TableComositeSpecification>): Promise<ITableDTO[]>
}
