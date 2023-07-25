import { merge, mergeWith, uniqBy } from 'lodash-es'
import type { IRecordUpdatedAuditDetail } from './audit-detail.vo.js'
import { AuditDetail } from './audit-detail.vo.js'
import type { Audit } from './audit.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customizer = (objValue: any, srcValue: any) => {
  if (Array.isArray(objValue)) {
    return uniqBy(objValue.concat(srcValue), 'id')
  }
}

export const mergeRecordUpdatedDetail = (exist: Audit, detail: IRecordUpdatedAuditDetail | null): AuditDetail => {
  if (!detail) return new AuditDetail({ value: null })
  const exisitDetail = exist.detail.into(null)?.value as IRecordUpdatedAuditDetail | null
  if (!exisitDetail) return new AuditDetail({ value: null })

  const { previousRecord, previousSchema, schema, record } = exisitDetail
  const newDetail: IRecordUpdatedAuditDetail = {
    previousRecord: merge(detail.previousRecord, previousRecord),
    previousSchema: mergeWith(detail.previousSchema, previousSchema, customizer),
    record: merge(record, detail.record),
    schema: mergeWith(schema, detail.schema, customizer),
  }

  return new AuditDetail(newDetail)
}
