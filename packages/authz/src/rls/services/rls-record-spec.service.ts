import type { ClsStore, IClsService, RecordCompositeSpecification } from '@undb/core'
import { andOptions } from '@undb/domain'
import type { Option } from 'oxide.ts'
import type { IRLSRepository } from '../rls.repository.js'
import { isUserMatch, withTableOfActionRLS } from '../specifications/index.js'
import type { IRLSAction } from '../value-objects/rls-policy.vo.js'

export interface IRLSRecordSpecService {
  list(tableId: string): Promise<Option<RecordCompositeSpecification>>
}

export class RLSRecordSpecService implements IRLSRecordSpecService {
  constructor(
    protected readonly repo: IRLSRepository,
    protected readonly cls: IClsService<ClsStore>,
  ) {}

  protected async getSpec(
    action: IRLSAction | [IRLSAction, ...IRLSAction[]],
    tableId: string,
  ): Promise<Option<RecordCompositeSpecification>> {
    const userId = this.cls.get('user.userId')
    const spec = withTableOfActionRLS(action, tableId)
    const rlss = await this.repo.find(spec)
    const specs = rlss.filter((rls) => isUserMatch(userId).isSatisfiedBy(rls)).map((r) => r.policy.getSpec(userId))
    return andOptions(...specs)
  }

  async list(tableId: string): Promise<Option<RecordCompositeSpecification>> {
    return this.getSpec('list', tableId)
  }
}
