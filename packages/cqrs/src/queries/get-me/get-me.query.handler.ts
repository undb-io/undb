import type { IQueryHandler } from '@egodb/domain'
import type { IGetMeOutput } from './get-me.query.interface.js'
import type { GetMeQuery } from './get-me.query.js'

export class GetMeQueryHandler implements IQueryHandler<GetMeQuery, IGetMeOutput> {
  async execute(query: GetMeQuery): Promise<IGetMeOutput> {
    const me = query.me

    return {
      me,
    }
  }
}
