import { AppOpenApiDocument, createSwaggerUISetup } from '@egodb/trpc'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { InjectOpenApiDocument } from './providers/open-api-document'

@Injectable()
export class TrpcSwaggerUISetupMiddleware implements NestMiddleware {
  constructor(@InjectOpenApiDocument() private readonly document: AppOpenApiDocument) {}

  use(req: Request, res: Response, next: NextFunction) {
    return createSwaggerUISetup(this.document)(req, res, next)
  }
}
