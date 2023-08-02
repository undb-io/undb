import type { RecordCompositeSpecification } from '@undb/core'
import { andOptions } from '@undb/domain'
import type { Option } from 'oxide.ts'
import type { IRLSRepository } from '../rls.repository.js'
import { withTableOfActionRLS } from '../specifications/index.js'
import type { IRLSAction } from '../value-objects/rls-policy.vo.js'

export interface IRLSRecordSpecService {
  list(tableId: string, viewId?: string): Promise<Option<RecordCompositeSpecification>>
}

export class RLSRecordSpecService implements IRLSRecordSpecService {
  constructor(protected readonly repo: IRLSRepository) {}

  private async getSpec(
    action: IRLSAction,
    tableId: string,
    viewId?: string,
  ): Promise<Option<RecordCompositeSpecification>> {
    const spec = withTableOfActionRLS(action, tableId, viewId)
    const rlss = await this.repo.find(spec)
    const specs = rlss.map((r) => r.policy.spec)
    return andOptions(...specs)
  }

  async list(tableId: string, viewId?: string | undefined): Promise<Option<RecordCompositeSpecification>> {
    return this.getSpec('list', tableId, viewId)
  }
}
