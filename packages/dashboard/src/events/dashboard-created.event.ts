import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { dashboardDTO } from "../dto"

const EVT_DASHBOARD_CREATED = "dashboard.created" as const

export const dashboardCreatedEventPayload = z.object({
  dashboard: dashboardDTO,
})

export type IDashboardCreatedEventPayload = z.infer<typeof dashboardCreatedEventPayload>

export class DashboardCreatedEvent extends BaseEvent<IDashboardCreatedEventPayload, typeof EVT_DASHBOARD_CREATED> {
  name = EVT_DASHBOARD_CREATED

  constructor(public readonly payload: IDashboardCreatedEventPayload) {
    super(payload, undefined, payload.dashboard.spaceId)
  }
}
