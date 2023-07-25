import { isEqual } from 'lodash-es'
import type { IRecordUpdatedAuditDetail } from '../audit-detail.vo.js'
import type { Audit } from '../audit.js'
import type { IAuditRepository } from '../audit.repository.js'
import { mergeRecordUpdatedDetail } from '../audit.util.js'
import { lastRecordUpdatedAuditSpec, WithAuditDetail, WithAuditTimestamp } from '../specifications/index.js'

export interface IAuditService {
  saveAudit(audit: Audit): Promise<void>
}

export class AuditService {
  constructor(protected readonly repo: IAuditRepository) {}

  async saveAudit(audit: Audit) {
    const qs = lastRecordUpdatedAuditSpec(audit.target.id, audit.operatorId)
    const found = await this.repo.findOne(qs)
    if (found.isNone() || audit.op !== 'record.updated') {
      await this.repo.insert(audit)
    } else {
      const exist = found.unwrap()
      const newDetail = mergeRecordUpdatedDetail(
        exist,
        audit.detail.into(null)?.value as IRecordUpdatedAuditDetail | null,
      )

      if (
        isEqual(
          (newDetail.value as IRecordUpdatedAuditDetail).record,
          (exist.detail.into()?.value as IRecordUpdatedAuditDetail).previousRecord,
        )
      ) {
        await this.repo.deleteOneById(exist.id.value)
      } else {
        const us = new WithAuditDetail(newDetail).and(WithAuditTimestamp.now())
        await this.repo.updateOneById(exist.id.value, us)
      }
    }
  }
}
