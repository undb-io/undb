import type { IBaseQueryModel } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import { None } from 'oxide.ts'
import type { IGetBasesOutput } from './get-bases.query.interface.js'
import type { GetBasesQuery } from './get-bases.query.js'

export class GetBasesQueryHandler implements IQueryHandler<GetBasesQuery, IGetBasesOutput> {
  constructor(protected readonly rm: IBaseQueryModel) {}

  async execute(query: GetBasesQuery): Promise<IGetBasesOutput> {
    const bases = await this.rm.find(None)

    return {
      bases,
    }
  }
}
