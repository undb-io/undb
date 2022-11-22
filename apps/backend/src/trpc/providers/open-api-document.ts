import { AppRouter, createOpenApiDocument } from '@egodb/trpc'
import { Inject, Provider } from '@nestjs/common'
import { AppRouterSymbol } from './app-router'

const OpenApiDocument = Symbol('OPEN_API_DOCUMENT')

export const InjectOpenApiDocument = () => Inject(OpenApiDocument)

export const OpenApiDocumentProvider: Provider = {
  provide: OpenApiDocument,
  useFactory: (appRouter: AppRouter) => createOpenApiDocument(appRouter),
  inject: [AppRouterSymbol],
}
