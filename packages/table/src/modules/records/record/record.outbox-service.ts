import type { IOutboxService } from "@undb/domain"
import type { IRecordEvent } from "../events"

export type IRecordOutboxService = IOutboxService<IRecordEvent>
