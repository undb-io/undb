import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

export * from './create-openapi-html.js'
export * from './create-openapi-schema.js'
