import type { IOutboxService } from "@undb/domain"
import type { TableDo } from "./table.do"

export interface ITableOutboxService extends IOutboxService<TableDo> {}
