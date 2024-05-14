import { container, inject } from "@undb/di"
import { TableService } from "./table.service"

export const TABLE_SERVICE = Symbol.for("TableService")
export const injectTableService = () => inject(TABLE_SERVICE)
container.register(TABLE_SERVICE, { useClass: TableService })
