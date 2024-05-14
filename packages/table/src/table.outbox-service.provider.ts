import { inject } from "@undb/di"

export const TABLE_OUTBOX_SERVICE = Symbol.for("TABLE_OUTBOX_SERVICE")
export const injectTableOutboxService = () => inject(TABLE_OUTBOX_SERVICE)
