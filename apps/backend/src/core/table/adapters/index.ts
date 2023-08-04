import type { Provider } from '@nestjs/common'
import { CSVExportor, RECORD_CSV_EXPORTOR } from '../exportor/csv.exportor.js'
import { ExcelExportor, RECORD_EXCEL_EXPORTOR } from '../exportor/excel.exportor.js'
import { NestRecordExportorService } from '../exportor/exportor.service.js'
import { JsonExportor, RECORD_JSON_EXPORTOR } from '../exportor/json.exportor.js'
import {
  NestAggregateSqliteQueryModel,
  RECORD_AGGREGATE_REPOSITORY,
} from './sqlite/record-sqlite.aggregate-repository.js'
import { NestRecordSqliteQueryModel, RECORD_QUERY_MODEL } from './sqlite/record-sqlite.query-model.js'
import { NestRecordSqliteRepository, RECORD_REPOSITORY } from './sqlite/record-sqlite.repository.js'
import { NestRecordSqliteTreeQueryModel, RECORD_TREE_QUERY_MODEL } from './sqlite/record-sqlite.tree-query-model.js'
import { NestTableKVCache } from './sqlite/table-kv.cache.js'
import { NestTableSqliteQueryModel, TABLE_QUERY_MODEL } from './sqlite/table-sqlite.query-model.js'
import { NestTableSqliteRepository, TABLE_KV_CACHE, TABLE_REPOSITORY } from './sqlite/table-sqlite.repository.js'

export const dbAdapters: Provider[] = [
  {
    provide: TABLE_REPOSITORY,
    useClass: NestTableSqliteRepository,
  },
  {
    provide: TABLE_QUERY_MODEL,
    useClass: NestTableSqliteQueryModel,
  },
  {
    provide: RECORD_REPOSITORY,
    useClass: NestRecordSqliteRepository,
  },
  {
    provide: RECORD_QUERY_MODEL,
    useClass: NestRecordSqliteQueryModel,
  },
  {
    provide: RECORD_TREE_QUERY_MODEL,
    useClass: NestRecordSqliteTreeQueryModel,
  },
  {
    provide: RECORD_AGGREGATE_REPOSITORY,
    useClass: NestAggregateSqliteQueryModel,
  },
  {
    provide: RECORD_CSV_EXPORTOR,
    useClass: CSVExportor,
  },
  {
    provide: RECORD_EXCEL_EXPORTOR,
    useClass: ExcelExportor,
  },
  {
    provide: RECORD_JSON_EXPORTOR,
    useClass: JsonExportor,
  },
  {
    provide: TABLE_KV_CACHE,
    useClass: NestTableKVCache,
  },
  NestRecordExportorService,
]
