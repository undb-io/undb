import { None, Some, andOptions, type IPagination, type Option, type PaginatedDTO } from "@undb/domain"
import type { TableId } from "../../../table-id.vo"
import type { TableDo } from "../../../table.do"
import { getSpec } from "../../schema/fields/condition"
import type { ViewId } from "../../views"
import type { AggregateResult, IGetRecordsDTO } from "../dto"
import { withQ } from "../specification/with-q.specification"
import type { IRecordDTO } from "./dto"
import type { RecordId } from "./record-id.vo"
import type { RecordComositeSpecification } from "./record.composite-specification"
import type { RecordDO } from "./record.do"

export interface SingleQueryArgs {
  select: Option<string[]>
}

export interface QueryArgs {
  select: Option<string[]>
  filter: Option<RecordComositeSpecification>
  pagination: Option<IPagination>
}

export interface IRecordRepository {
  insert(table: TableDo, record: RecordDO): Promise<void>
  buldInsert(table: TableDo, records: RecordDO[]): Promise<void>
  findOne(table: TableDo, spec: Option<RecordComositeSpecification>): Promise<Option<RecordDO>>
  findOneById(table: TableDo, id: RecordId): Promise<Option<RecordDO>>
  updateOneById(table: TableDo, record: RecordDO, spec: Option<RecordComositeSpecification>): Promise<void>
  deleteOneById(table: TableDo, record: RecordDO): Promise<void>
}

export interface IRecordQueryRepository {
  find(table: TableDo, viewId: Option<ViewId>, query: Option<QueryArgs>): Promise<PaginatedDTO<IRecordDTO>>
  findOneById(table: TableDo, id: RecordId, query: Option<SingleQueryArgs>): Promise<Option<IRecordDTO>>
  count(tableId: TableId): Promise<number>

  aggregate(table: TableDo, viewId: Option<ViewId>): Promise<Record<string, AggregateResult>>
}

export function buildQuery(table: TableDo, dto: IGetRecordsDTO): Option<QueryArgs> {
  const query: QueryArgs = {
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
  if (dto.filters) {
    const spec = getSpec(table.schema.fieldMapById, dto.filters) as Option<RecordComositeSpecification>
    if (query.filter) {
      query.filter = andOptions(query.filter, spec) as Option<RecordComositeSpecification>
    } else {
      query.filter = spec
    }
  }
  if (dto.select) {
    query.select = Some(dto.select)
  }
  return Some(query)
}
