import { convert, type ConvertResult } from 'openapi-to-postmanv2'
import type { OpenAPIObject } from 'openapi3-ts/oas31'
import type { CollectionDefinition } from 'postman-collection'
import type { IOpenAPIConvertor } from './openapi.convertor.js'

export class PostmanCollectionConvertor implements IOpenAPIConvertor<CollectionDefinition> {
  async convert(spec: OpenAPIObject): Promise<CollectionDefinition> {
    return new Promise((resolve, reject) => {
      convert({ type: 'json', data: spec as any }, {}, (err, result) => {
        if (err) return reject(err)

        if (result.result) {
          const collection = result.output[0]?.data
          if (collection) {
            resolve(collection)
          }
        } else {
          reject(result.reason)
        }
      })
    })
  }
}

export type IPostmanCollectionConvertor = IOpenAPIConvertor<ConvertResult>
