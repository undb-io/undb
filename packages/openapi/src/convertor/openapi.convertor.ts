import type { OpenAPIObject } from 'openapi3-ts/oas30'

export interface IOpenAPIConvertor<T> {
  convert(spec: OpenAPIObject): T | Promise<T>
}
