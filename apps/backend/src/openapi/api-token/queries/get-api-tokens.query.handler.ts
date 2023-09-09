import { QueryHandler } from '@nestjs/cqrs'
import type { ClsStore, IClsService } from '@undb/core'
import { GetApiTokensQuery, GetApiTokensQueryHandler } from '@undb/cqrs'
import { type IApiTokenQueryModel } from '@undb/openapi'
import { ClsService } from 'nestjs-cls'
import { InjectApiTokenQueryModel } from '../adapters/api-token.sqlite-query-model.js'

@QueryHandler(GetApiTokensQuery)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class NestGetApiTokensQueryHandler extends GetApiTokensQueryHandler {
  constructor(
    @InjectApiTokenQueryModel()
    protected readonly rm: IApiTokenQueryModel,
    protected readonly cls: ClsService<ClsStore>,
  ) {
    super(rm, cls as IClsService<ClsStore>)
  }
}
