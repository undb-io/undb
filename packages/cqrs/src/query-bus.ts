import { container, singleton, type DependencyContainer } from "@undb/di"
import type { IQueryBus, IQueryHandler, IQueryPublisher, Query, QueryMetadata } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { Subject } from "rxjs"
import type { Class } from "type-fest"
import { QUERY_HANDLER_METADATA, QUERY_METADATA } from "./decorators/constants"
import { DefaultQueryPubSub } from "./default-query-publisher"
import { InvalidQueryHandlerException } from "./exceptions/invalid-query-handler.exception"
import { QueryHandlerNotFoundException } from "./exceptions/query-handler-not-found.exception"

export type QueryHandlerType = Class<IQueryHandler<Query, any>>

@singleton()
export class QueryBus<Q extends Query = Query> implements IQueryBus {
  private readonly logger = createLogger(QueryBus.name)
  private subject = new Subject<Query>()
  private readonly publisher: IQueryPublisher = new DefaultQueryPubSub(this.subject)

  #handlers = new Map<string, IQueryHandler<Q, any>>()

  async execute<T extends Q, R = any>(query: T): Promise<R> {
    try {
      const queryId = this.getQueryId(query)
      const handler = this.#handlers.get(queryId)
      if (!handler) {
        const queryName = this.getQueryName(query)
        throw new QueryHandlerNotFoundException(queryName)
      }
      this.publisher.publish(query)
      return await handler.execute(query)
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  register(handlers: QueryHandlerType[] = [], c = container) {
    handlers.forEach((handler) => this.registerHandler(c, handler))
  }

  private bind<T extends Q>(handler: IQueryHandler<T, any>, id: string) {
    this.#handlers.set(id, handler)
  }

  protected registerHandler(container: DependencyContainer, handler: QueryHandlerType) {
    const instance = container.resolve(handler)
    if (!instance) {
      return
    }
    const target = this.reflectQueryId(handler)
    if (!target) {
      throw new InvalidQueryHandlerException()
    }
    this.bind(instance as IQueryHandler<Q, any>, target)
  }

  private reflectQueryId(handler: QueryHandlerType): string | undefined {
    const query: Query = Reflect.getMetadata(QUERY_HANDLER_METADATA, handler)
    const queryMetadata: QueryMetadata = Reflect.getMetadata(QUERY_METADATA, query)
    return queryMetadata.id
  }

  private getQueryId(query: Q): string {
    const { constructor: queryType } = Object.getPrototypeOf(query)
    const queryMetadata: QueryMetadata = Reflect.getMetadata(QUERY_METADATA, queryType)
    if (!queryMetadata) {
      throw new QueryHandlerNotFoundException(queryType.name)
    }

    return queryMetadata.id
  }

  private getQueryName(query: Q): string {
    const { constructor } = Object.getPrototypeOf(query)
    return constructor.name as string
  }
}
