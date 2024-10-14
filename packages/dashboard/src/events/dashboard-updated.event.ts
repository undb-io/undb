import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { dashboardDTO } from "../dto"

const EVT_DASHBOARD_UPDATED = "dashboard.updated" as const

export const dashboardUpdatedEventPayload = z.object({
  previous: dashboardDTO,
  dashboard: dashboardDTO,
})

export type IDashboardUpdatedEventPayload = z.infer<typeof dashboardUpdatedEventPayload>

export class DashboardUpdatedEvent extends BaseEvent<IDashboardUpdatedEventPayload, typeof EVT_DASHBOARD_UPDATED> {
  name = EVT_DASHBOARD_UPDATED

  constructor(public readonly payload: IDashboardUpdatedEventPayload) {
    super(payload, undefined, payload.dashboard.spaceId)
  }
}
