import { IUserQueryModel } from '@egodb/core'
import type { IQueryHandler } from '@egodb/domain'
import type { IGetMeOutput } from './get-me.query.interface.js'
import type { GetMeQuery } from './get-me.query.js'

export class GetMeQueryHandler implements IQueryHandler<GetMeQuery, IGetMeOutput> {
  constructor(protected readonly rm: IUserQueryModel) {}
  async execute(query: GetMeQuery): Promise<IGetMeOutput> {
    const user = (await this.rm.findOneById(query.me.userId)).into()
    if (!user) throw new Error('not found me')

    return {
      me: user,
    }
  }
}
