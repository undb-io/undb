import type { IOutboxService } from "@undb/domain"
import type { ITableEvents } from "./events"

export interface ITableOutboxService extends IOutboxService<ITableEvents> {}
