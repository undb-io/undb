import type { IPagination, Option, PaginatedDTO } from "@undb/domain"
import type { TableId } from "../../../table-id.vo"
import type { TableDo } from "../../../table.do"
import type { ViewId } from "../../views"
import type { IRecordDTO } from "./dto"
import type { RecordId } from "./record-id.vo"
import type { RecordComositeSpecification } from "./record.composite-specification"
import type { RecordDO } from "./record.do"

export interface Query {
  select: Option<RecordComositeSpecification>
  filter: Option<RecordComositeSpecification>
  pagination: Option<IPagination>
}

export interface IRecordRepository {
  insert(table: TableDo, record: RecordDO): Promise<void>
  findOneById(table: TableDo, id: RecordId): Promise<Option<RecordDO>>
  updateOneById(table: TableDo, id: RecordId, spec: Option<RecordComositeSpecification>): Promise<void>
}

export interface IRecordQueryRepository {
  find(table: TableDo, viewId: Option<ViewId>, query: Option<Query>): Promise<PaginatedDTO<IRecordDTO>>
  count(tableId: TableId): Promise<number>
}
