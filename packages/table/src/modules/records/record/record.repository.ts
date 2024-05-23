import { None, Some, type IPagination, type Option, type PaginatedDTO } from "@undb/domain"
import type { TableId } from "../../../table-id.vo"
import type { TableDo } from "../../../table.do"
import type { ViewId } from "../../views"
import type { IGetRecordsDTO } from "../dto"
import { withQ } from "../specification/with-q.specification"
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
  findOne(table: TableDo, spec: Option<RecordComositeSpecification>): Promise<Option<RecordDO>>
  findOneById(table: TableDo, id: RecordId): Promise<Option<RecordDO>>
  updateOneById(table: TableDo, record: RecordDO, spec: Option<RecordComositeSpecification>): Promise<void>
}

export interface IRecordQueryRepository {
  find(table: TableDo, viewId: Option<ViewId>, query: Option<Query>): Promise<PaginatedDTO<IRecordDTO>>
  findOneById(table: TableDo, id: RecordId): Promise<Option<IRecordDTO>>
  count(tableId: TableId): Promise<number>
}

export function buildQuery(table: TableDo, dto: IGetRecordsDTO) {
  const query: Query = {
    filter: None,
    select: None,
    pagination: None,
  }

  if (dto.pagination) {
    query.pagination = Some(dto.pagination)
  }
  if (dto.q) {
    query.filter = withQ(table, dto.q)
  }
  return Some(query)
}
