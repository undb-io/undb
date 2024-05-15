import type { IOutboxService } from "@undb/domain"
import type { RecordDO } from "."

export type IRecordOutboxService = IOutboxService<RecordDO>
