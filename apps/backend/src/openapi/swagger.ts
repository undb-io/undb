import type { INestApplication } from '@nestjs/common'
import type { SwaggerDocumentOptions } from '@nestjs/swagger'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import packageFile from '../../../../package.json' assert { type: 'json' }
import { API_TAG_RECORD, API_TAG_SUBSCRIPTION, API_TAG_WEBHOOK } from './openapi.constants.js'
import { OpenAPIModule } from './openapi.module.js'

const OPENAPI_SWAGGER_PATH = 'openapi'

export const configureOpenAPISwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('undb openapi')
    .setDescription('undb open api documentation')
    .setVersion(packageFile.version)
    .addBearerAuth()
    .addTag(API_TAG_RECORD)
    .addTag(API_TAG_WEBHOOK)
    .addTag(API_TAG_SUBSCRIPTION)
    .build()

  const options: SwaggerDocumentOptions = {
    include: [OpenAPIModule],
  }

  const document = SwaggerModule.createDocument(app, config, options)
  SwaggerModule.setup(OPENAPI_SWAGGER_PATH, app, document)
}
