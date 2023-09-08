import { ApiTokenFactory, WithApiTokenId, type ApiToken as ApiTokenDo, type IQueryApiToken } from '@undb/openapi'
import type { ApiToken } from '../../entity/api-token.js'

export class ApiTokenSqliteMapper {
  static toQuery(apiToken: ApiToken): IQueryApiToken {
    return {
      id: apiToken.id,
    }
  }

  static toDomain(apiToken: ApiToken): ApiTokenDo {
    return ApiTokenFactory.create(WithApiTokenId.fromString(apiToken.id))
  }
}
