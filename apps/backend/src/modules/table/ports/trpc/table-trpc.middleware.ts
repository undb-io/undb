import { AppRouter, createExpressMiddleware, createRouter } from '@egodb/trpc'
import { Injectable, NestMiddleware, OnModuleInit } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class TableTrpcMiddleware implements OnModuleInit, NestMiddleware {
  constructor(private readonly commandBus: CommandBus) {}

  private appRouter!: AppRouter
  onModuleInit() {
    this.appRouter = createRouter(this.commandBus)
  }

  use(req: Request, res: Response, next: NextFunction) {
    return createExpressMiddleware(this.appRouter)(req, res, next)
  }
}
