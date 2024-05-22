import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"
import { z } from "@undb/zod"

extendZodWithOpenApi(z)

import type { RecordDO, TableDo } from "@undb/table"
import { RECORD_COMPONENT, createRecordComponent, getRecords } from "./openapi/record.openapi"

export const createOpenApiSpec = (table: TableDo, record?: RecordDO) => {
  const registry = new OpenAPIRegistry()

  const recordSchema = createRecordComponent(table)
  registry.register(RECORD_COMPONENT, recordSchema)

  registry.registerPath(getRecords(table, recordSchema))

  const generator = new OpenApiGeneratorV3(registry.definitions)

  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      version: "1.0.0",
      title: table.name.value,
    },
    servers: [{ url: "/api" }],
  })
}
