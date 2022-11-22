import { AppRouter, createExpressMiddleware } from '@egodb/trpc'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { InjectAppRouter } from './providers/app-router'

@Injectable()
export class TrpcMiddleware implements NestMiddleware {
  constructor(@InjectAppRouter() private readonly appRouter: AppRouter) {}

  use(req: Request, res: Response, next: NextFunction) {
    return createExpressMiddleware(this.appRouter)(req, res, next)
  }
}
