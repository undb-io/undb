import type { IMemberQueryModel } from '@undb/authz'
import type { IQueryHandler } from '@undb/domain'
import { None } from 'oxide.ts'
import type { IGetMembersOutput } from './get-members.query.interface.js'
import type { GetMembersQuery } from './get-members.query.js'

export class GetMembersQueryHandler implements IQueryHandler<GetMembersQuery, IGetMembersOutput> {
  constructor(protected readonly rm: IMemberQueryModel) {}
  async execute(query: GetMembersQuery): Promise<IGetMembersOutput> {
    const members = await this.rm.find(None)

    return {
      members,
    }
  }
}
