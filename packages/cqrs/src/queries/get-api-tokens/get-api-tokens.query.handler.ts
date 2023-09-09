import type { ClsStore, IClsService } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IApiTokenQueryModel } from '@undb/openapi'
import { WithApiTokenUserId } from '@undb/openapi'
import type { IGetApiTokensOutput } from './get-api-tokens.query.interface.js'
import type { GetApiTokensQuery } from './get-api-tokens.query.js'

export class GetApiTokensQueryHandler implements IQueryHandler<GetApiTokensQuery, IGetApiTokensOutput> {
  constructor(
    protected readonly rm: IApiTokenQueryModel,
    protected readonly cls: IClsService<ClsStore>,
  ) {}
  async execute(query: GetApiTokensQuery): Promise<IGetApiTokensOutput> {
    const userId = this.cls.get('user.userId')
    const apiTokens = await this.rm.find(WithApiTokenUserId.fromString(userId))

    return {
      apiTokens,
    }
  }
}
