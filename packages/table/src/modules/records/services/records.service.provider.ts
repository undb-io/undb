import { container, inject } from "@undb/di"
import { RecordsService } from "./records.service"

export const RECORDS_SERVICE = Symbol.for("RECORDS_SERVICE")
export const injectRecordsService = () => inject(RECORDS_SERVICE)
container.register(RECORDS_SERVICE, { useClass: RecordsService })
