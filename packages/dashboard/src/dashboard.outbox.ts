import { inject } from "@undb/di"
import type { IOutboxService } from "@undb/domain"
import type { Dashboard } from "./dashboard.do"

export interface IDashboardOutboxService extends IOutboxService<Dashboard> {}

export const DASHBOARD_OUTBOX_SERVICE = Symbol("DASHBOARD_OUTBOX_SERVICE")

export const injectDashboardOutboxService = () => inject(DASHBOARD_OUTBOX_SERVICE)
