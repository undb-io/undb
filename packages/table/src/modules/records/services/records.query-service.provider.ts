import { container, inject } from "@undb/di"
import { RecordsQueryService } from "./records.query-service"

export const RECORDS_QUERY_SERVICE = Symbol.for("RECORDS_QUERY_SERVICE")
export const injectRecordsQueryService = () => inject(RECORDS_QUERY_SERVICE)
container.register(RECORDS_QUERY_SERVICE, { useClass: RecordsQueryService })
