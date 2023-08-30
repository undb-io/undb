import type { ClsStore, IClsService, Table } from '@undb/core'
import type { FLS } from '../fls'
import { FLSNotAuthorized } from '../fls.errors'
import type { IFLSRepository } from '../fls.repository'
import { isFLSUserMatch, withTableOfActionFLS } from '../specifications/index.js'
import type { IFLSAction } from '../value-objects/index.js'

export interface IFLSAuthzService {
  check(action: IFLSAction, table: Table, fieldIds: string[]): Promise<void>
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

  async check(action: IFLSAction, table: Table, fieldIds: string[]): Promise<void> {
    const flss = await this.getFLSS(action, table.id.value)
    const flsFieldIds = flss.map((fls) => fls.fieldId.value)
    if (!flsFieldIds.some((id) => fieldIds.includes(id))) {
      throw new FLSNotAuthorized()
    }
  }
}
