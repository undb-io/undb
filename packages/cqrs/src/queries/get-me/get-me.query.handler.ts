import type { ClsStore, IClsService, IUserQueryModel } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IGetMeOutput } from './get-me.query.interface.js'
import type { GetMeQuery } from './get-me.query.js'

export class GetMeQueryHandler implements IQueryHandler<GetMeQuery, IGetMeOutput> {
  constructor(
    protected readonly rm: IUserQueryModel,
    protected readonly cls: IClsService<ClsStore>,
  ) {}
  async execute(query: GetMeQuery): Promise<IGetMeOutput> {
    const user = (await this.rm.findOneById(query.me.userId)).into()
    if (!user) throw new Error('not found me')

    return {
      me: user,
      member: {
        memberId: this.cls.get('member.memberId'),
        role: this.cls.get('member.role'),
      },
    }
  }
}
