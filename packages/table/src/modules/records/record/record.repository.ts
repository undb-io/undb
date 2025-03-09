import { type IPagination, None, type Option, type PaginatedDTO, Some, andOptions } from "@undb/domain"
import type { TableId } from "../../../table-id.vo"
import type { TableDo } from "../../../table.do"
import { getSpec } from "../../schema/fields/condition"
import type { IViewAggregate, View, ViewId } from "../../views"
import type { AggregateResult, ICountRecordsDTO, IGetPivotDataOutput, IGetRecordsDTO } from "../dto"
import { withQ } from "../specification/with-q.specification"
import type { IRecordDTO } from "./dto"
import type { RecordId } from "./record-id.vo"
import type { RecordComositeSpecification } from "./record.composite-specification"
import type { RecordDO } from "./record.do"

export interface SingleQueryArgs {
  select: Option<string[]>
  view: View
  ignoreView?: boolean
}

export interface CountQueryArgs {
  filter: Option<RecordComositeSpecification>
  select: Option<string[]>
}

export interface QueryArgs {
  select: Option<string[]>
  filter: Option<RecordComositeSpecification>
  pagination: Option<IPagination>
  ignoreView?: boolean
}

export interface IRecordRepository {
  insert(table: TableDo, record: RecordDO): Promise<void>
  bulkInsert(table: TableDo, records: RecordDO[]): Promise<void>
  findOne(table: TableDo, spec: Option<RecordComositeSpecification>): Promise<Option<RecordDO>>
  findOneById(table: TableDo, id: RecordId): Promise<Option<RecordDO>>
  findByIds(table: TableDo, ids: RecordId[]): Promise<RecordDO[]>
  find(table: TableDo, spec: Option<RecordComositeSpecification>): Promise<RecordDO[]>
  updateOneById(table: TableDo, record: RecordDO, spec: Option<RecordComositeSpecification>): Promise<void>
  bulkUpdate(
    table: TableDo,
    spec: Option<RecordComositeSpecification>,
    update: RecordComositeSpecification,
    records: RecordDO[],
  ): Promise<void>
  deleteOneById(table: TableDo, record: RecordDO): Promise<void>
  deleteByIds(table: TableDo, records: RecordDO[]): Promise<void>
}

export interface IRecordQueryRepository {
  find(table: TableDo, view: View, query: Option<QueryArgs>): Promise<PaginatedDTO<IRecordDTO>>
  findOneById(table: TableDo, id: RecordId, query: Option<SingleQueryArgs>): Promise<Option<IRecordDTO>>
  count(tableId: TableId): Promise<number>
  countWhere(table: TableDo, view: View | undefined, spec: Option<CountQueryArgs>): Promise<number>
  getPivotData(table: TableDo, viewId: string): Promise<IGetPivotDataOutput>

  aggregate(
    table: TableDo,
    viewId: Option<ViewId>,
    aggregate: Option<IViewAggregate>,
    query: Option<QueryArgs>,
  ): Promise<Record<string, AggregateResult>>
}

export function buildQuery(table: TableDo, dto: IGetRecordsDTO): Option<QueryArgs> {
  const query: QueryArgs = {
    filter: None,
    select: None,
    pagination: None,
    ignoreView: dto.ignoreView,
  }

  if (dto.pagination) {
    query.pagination = Some(dto.pagination)
  }
  if (dto.q) {
    query.filter = withQ(table, dto.q)
  }
  if (dto.filters) {
    const spec = getSpec(table.schema, dto.filters) as Option<RecordComositeSpecification>
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

export function buildCountQuery(table: TableDo, dto: ICountRecordsDTO): Option<CountQueryArgs> {
  const query: CountQueryArgs = {
    filter: None,
    select: None,
  }

  if (dto.q) {
    query.filter = withQ(table, dto.q)
  }
  if (dto.filters) {
    const spec = getSpec(table.schema, dto.filters) as Option<RecordComositeSpecification>
    if (query.filter) {
      query.filter = andOptions(query.filter, spec) as Option<RecordComositeSpecification>
    } else {
      query.filter = spec
    }
  }
  return Some(query)
}
