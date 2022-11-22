import { createRouter } from '@egodb/trpc'
import { Inject, Provider } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'

export const AppRouterSymbol = Symbol('APP_ROUTER')

export const InjectAppRouter = () => Inject(AppRouterSymbol)

export const AppRouterProvider: Provider = {
  provide: AppRouterSymbol,
  useFactory: (commandBus: CommandBus) => createRouter(commandBus),
  inject: [CommandBus],
}
