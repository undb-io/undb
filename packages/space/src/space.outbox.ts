import { inject } from "@undb/di"
import type { IOutboxService } from "@undb/domain"
import type { Space } from "./space.do"

export interface ISpaceOutboxService extends IOutboxService<Space> {}

export const SPACE_OUTBOX_SERVICE = Symbol("SPACE_OUTBOX_SERVICE")

export const injectSpaceOutboxService = () => inject(SPACE_OUTBOX_SERVICE)
