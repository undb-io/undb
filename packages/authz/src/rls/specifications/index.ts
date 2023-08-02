import { IRLSAction } from '../value-objects/rls-policy.vo.js'
import { WithRLSAction } from './rls-policy.specification.js'
import { WithRLSTableId } from './rls-table-id.specification.js'
import { WithRLSViewId } from './rls-view-id.specification.js'

export * from './rls-id.specification.js'
export * from './rls-policy.specification.js'
export * from './rls-table-id.specification.js'
export * from './rls-view-id.specification.js'

export const withTableRLS = (tableId: string, viewId?: string) =>
  WithRLSTableId.fromString(tableId).and(WithRLSViewId.fromString(viewId))

export const withTableOfActionRLS = (action: IRLSAction, tableId: string, viewId?: string) =>
  withTableRLS(tableId, viewId).and(new WithRLSAction(action))
