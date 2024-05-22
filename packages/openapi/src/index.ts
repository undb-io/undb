import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"
import { z } from "@undb/zod"

extendZodWithOpenApi(z)

import type { TableDo } from "@undb/table"
import { RECORD_COMPONENT, createRecordComponent } from "./components/record"

export const createOpenApiSpec = (table: TableDo) => {
  const registry = new OpenAPIRegistry()

  const recordSchema = createRecordComponent(table)
  registry.register(RECORD_COMPONENT, recordSchema)

  registry.registerPath({
    method: "get",
    path: "/users/{id}",
    description: "Get user data by its id",
    summary: "Get a single user",
    request: {
      params: z.object({
        id: z.string().openapi({ example: "1212121" }),
      }),
    },
    responses: {
      200: {
        description: "Object with user data.",
        content: {
          "application/json": {
            schema: recordSchema,
          },
        },
      },
      204: {
        description: "No content - successful operation",
      },
    },
  })

  const generator = new OpenApiGeneratorV3(registry.definitions)

  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      version: "1.0.0",
      title: table.name.value,
    },
    servers: [{ url: "/" }],
  })
}
