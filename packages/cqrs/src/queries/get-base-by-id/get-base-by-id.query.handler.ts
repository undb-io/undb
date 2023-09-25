import type { IBaseQueryModel } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IGetBaseByIdOutput } from './get-base-by-id.query.interface.js'
import type { GetBaseByIdQuery } from './get-bases.query.js'

export class GetBaseByIdQueryHandler implements IQueryHandler<GetBaseByIdQuery, IGetBaseByIdOutput> {
  constructor(protected readonly rm: IBaseQueryModel) {}

  async execute(query: GetBaseByIdQuery): Promise<IGetBaseByIdOutput> {
    const base = await this.rm.findOneById(query.id)

    return {
      base: base.into(),
    }
  }
}
