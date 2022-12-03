import type { AppRouter } from '@egodb/trpc'
import { createOpenApiDocument } from '@egodb/trpc'
import type { Provider } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { AppRouterSymbol } from './app-router'

export const OpenApiDocument = Symbol('OPEN_API_DOCUMENT')

export const InjectOpenApiDocument = () => Inject(OpenApiDocument)

export const OpenApiDocumentProvider: Provider = {
  provide: OpenApiDocument,
  useFactory: (appRouter: AppRouter) => createOpenApiDocument(appRouter),
  inject: [AppRouterSymbol],
}
