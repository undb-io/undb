import type { Provider } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { createRouter } from '@undb/trpc'
import { Logger } from 'nestjs-pino'

export const AppRouterSymbol = Symbol('APP_ROUTER')

export const InjectAppRouter = () => Inject(AppRouterSymbol)

export const AppRouterProvider: Provider = {
  provide: AppRouterSymbol,
  useFactory: createRouter,
  inject: [CommandBus, QueryBus, Logger],
}
