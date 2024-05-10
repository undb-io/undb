import type { Option } from '@undb/domain'
import type { TableDo } from '../../../table.do'
import type { IRecordsDTO } from '../dto/records.dto'
import type { RecordComositeSpecification } from './record.composite-specification'
import type { RecordDO } from './record.do'

export interface Query {
  select: Option<RecordComositeSpecification>
  filter: Option<RecordComositeSpecification>
}

export interface IRecordRepository {
  insert(table: TableDo, record: RecordDO): Promise<void>
}

export interface IRecordQueryRepository {
  find(table: TableDo, query: Option<Query>): Promise<IRecordsDTO>
}
