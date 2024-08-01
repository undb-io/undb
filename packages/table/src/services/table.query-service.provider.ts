import { container, inject } from "@undb/di"
import { TableQueryService } from "./table.query-service"

export const TABLE_QUERY_SERVICE = Symbol.for("TableQueryService")
export const injectTableQueryService = () => inject(TABLE_QUERY_SERVICE)
container.register(TABLE_QUERY_SERVICE, { useClass: TableQueryService })
