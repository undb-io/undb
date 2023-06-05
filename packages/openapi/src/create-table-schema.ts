import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import type { OpenAPIObject } from 'openapi3-ts/oas30'
import { z } from 'zod'

export const createTableSchema = (): OpenAPIObject => {
  const registry = new OpenAPIRegistry()

  function getOpenApiDocumentation() {
    const generator = new OpenApiGeneratorV3(registry.definitions)

    return generator.generateDocument({
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'My API',
        description: 'This is the API',
      },
      servers: [{ url: 'v1' }],
    })
  }

  const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  })

  const userSchema = z
    .object({
      id: z.string().openapi({ example: '1212121' }),
      name: z.string().openapi({ example: 'John Doe' }),
      age: z.number().openapi({ example: 42 }),
    })
    .openapi('User')

  registry.registerPath({
    method: 'get',
    path: '/users/{id}',
    description: 'Get user data by its id',
    summary: 'Get a single user',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: z.object({ id: z.string() }),
    },
    responses: {
      200: {
        description: 'Object with user data.',
        content: {
          'application/json': {
            schema: userSchema,
          },
        },
      },
      204: {
        description: 'No content - successful operation',
      },
    },
  })

  const docs = getOpenApiDocumentation()
  return docs
}
