import type { Record, Records, Table } from '@undb/core'
import { RLSNotAuthorized } from '../rls.errors.js'
import type { IRLSAction } from '../value-objects/index.js'
import { RLSRecordSpecService } from './rls-record-spec.service.js'

export interface IRLSAuthzService {
  check(action: IRLSAction, table: Table, record: Record, viewId?: string): Promise<void>
  checkMany(action: IRLSAction, table: Table, records: Records, viewId?: string): Promise<void>
}

export class RLSAuthzService extends RLSRecordSpecService implements IRLSAuthzService {
  async checkMany(action: IRLSAction, table: Table, records: Records, viewId?: string | undefined): Promise<void> {
    const spec = await this.getSpec(action, table.id.value, viewId)
    if (spec.isNone()) return

    for (const record of records) {
      const isSatisfiedBy = spec.unwrap().isSatisfiedBy(record)
      if (!isSatisfiedBy) throw new RLSNotAuthorized()
    }
  }

  async check(action: IRLSAction, table: Table, record: Record, viewId?: string): Promise<void> {
    const spec = await this.getSpec(action, table.id.value, viewId)
    if (spec.isNone()) return

    const isSatisfiedBy = spec.unwrap().isSatisfiedBy(record)
    if (!isSatisfiedBy) throw new RLSNotAuthorized()
  }
}
