import { inject } from "@undb/di"

export const RECORD_OUTBOX_SERVICE = Symbol.for("RECORD_OUTBOX_SERVICE")
export const injectRecordOutboxService = () => inject(RECORD_OUTBOX_SERVICE)
