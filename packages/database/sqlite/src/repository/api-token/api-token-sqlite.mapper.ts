import {
  ApiTokenFactory,
  WithApiTokenId,
  WithApiTokenToken,
  WithApiTokenUserId,
  type ApiToken as ApiTokenDo,
  type IQueryApiToken,
} from '@undb/openapi'
import type { ApiToken } from '../../entity/api-token.js'

export class ApiTokenSqliteMapper {
  static toQuery(apiToken: ApiToken): IQueryApiToken {
    return {
      id: apiToken.id,
      token: apiToken.token,
      userId: apiToken.user.id,
    }
  }

  static toDomain(apiToken: ApiToken): ApiTokenDo {
    return ApiTokenFactory.create(
      WithApiTokenId.fromString(apiToken.id),
      WithApiTokenToken.fromString(apiToken.token),
      WithApiTokenUserId.fromString(apiToken.user.id),
    )
  }
}
