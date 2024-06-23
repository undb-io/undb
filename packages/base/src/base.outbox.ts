import { inject } from "@undb/di"
import type { IOutboxService } from "@undb/domain"
import type { Base } from "./base"

export interface IBaseOutboxService extends IOutboxService<Base> {}

export const BASE_OUTBOX_SERVICE = Symbol("BASE_OUTBOX_SERVICE")

export const injectBaseOutboxService = () => inject(BASE_OUTBOX_SERVICE)
