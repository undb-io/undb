import { createRouter } from '@egodb/trpc'
import type { Provider } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'

export const AppRouterSymbol = Symbol('APP_ROUTER')

export const InjectAppRouter = () => Inject(AppRouterSymbol)

export const AppRouterProvider: Provider = {
  provide: AppRouterSymbol,
  useFactory: (commandBus: CommandBus, queryBus: QueryBus) => createRouter(commandBus, queryBus),
  inject: [CommandBus, QueryBus],
}
