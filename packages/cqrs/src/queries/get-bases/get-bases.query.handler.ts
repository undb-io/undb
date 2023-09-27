import type { BaseSpecification, IBaseQueryModel } from '@undb/core'
import { WithBaseQ } from '@undb/core'
import { and, type IQueryHandler } from '@undb/domain'
import type { IGetBasesOutput } from './get-bases.query.interface.js'
import type { GetBasesQuery } from './get-bases.query.js'

export class GetBasesQueryHandler implements IQueryHandler<GetBasesQuery, IGetBasesOutput> {
  constructor(protected readonly rm: IBaseQueryModel) {}

  async execute(query: GetBasesQuery): Promise<IGetBasesOutput> {
    const specs: BaseSpecification[] = []

    if (query.q) {
      specs.push(new WithBaseQ(query.q))
    }

    const spec = and(...specs)
    const bases = await this.rm.find(spec)

    return {
      bases,
    }
  }
}
