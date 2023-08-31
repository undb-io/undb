import type { ClsStore, IClsService, Record, Table } from '@undb/core'
import { andOptions } from '@undb/domain'
import type { FLS } from '../fls'
import { FLSNotAuthorized } from '../fls.errors'
import type { IFLSRepository } from '../fls.repository'
import { isFLSUserMatch, withTableOfActionFLS } from '../specifications/index.js'
import type { IFLSAction } from '../value-objects/index.js'

export interface IFLSAuthzService {
  check(action: IFLSAction, table: Table, record: Record, fieldIds: string[]): Promise<void>
}

export class FLSAuthzService implements IFLSAuthzService {
  constructor(
    protected readonly repo: IFLSRepository,
    protected readonly cls: IClsService<ClsStore>,
  ) {}

  private async getFLSS(action: IFLSAction, tableId: string): Promise<FLS[]> {
    const userId = this.cls.get('user.userId')
    const spec = withTableOfActionFLS(action, tableId)
    let flss = await this.repo.find(spec)
    flss = flss.filter((fls) => isFLSUserMatch(userId).isSatisfiedBy(fls))
    return flss
  }

  async check(action: IFLSAction, table: Table, record: Record, fieldIds: string[]): Promise<void> {
    const userId = this.cls.get('user.userId')

    const flss = await this.getFLSS(action, table.id.value)

    for (const fieldId of fieldIds) {
      const fs = flss.filter((fls) => fls.fieldId.value === fieldId)
      if (!fs.length) continue

      const specs = fs.map((fls) => fls.policy.getSpec(userId))
      const spec = andOptions(...specs)

      const isSatisfiedBy = spec.unwrap().isSatisfiedBy(record)
      if (!isSatisfiedBy) throw new FLSNotAuthorized()
    }
  }
}
