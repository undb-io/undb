import { QueryHandler } from '@nestjs/cqrs'
import type { ClsStore, IClsService } from '@undb/core'
import { type IUserQueryModel } from '@undb/core'
import { GetMeQuery, GetMeQueryHandler } from '@undb/cqrs'
import { ClsService } from 'nestjs-cls'
import { InjectUserQueryModel } from '../../core/user/adapters/index.js'

@QueryHandler(GetMeQuery)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class NestGetMeQueryHandler extends GetMeQueryHandler {
  constructor(
    @InjectUserQueryModel() protected readonly rm: IUserQueryModel,
    protected readonly cls: ClsService<ClsStore>,
  ) {
    super(rm, cls as IClsService<ClsStore>)
  }
}
