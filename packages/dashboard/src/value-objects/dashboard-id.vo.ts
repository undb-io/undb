import { NanoID } from "@undb/domain"
import { z } from "@undb/zod"

export const dashboardIdSchema = z.string().min(1)

export class DashboardId extends NanoID {
  private static DASHBOARD_ID_PREFIX = "dsh"
  private static DASHBOARD_ID_SIZE = 8

  static create(): DashboardId {
    const id = NanoID.createId(DashboardId.DASHBOARD_ID_PREFIX, DashboardId.DASHBOARD_ID_SIZE)
    return new DashboardId(id)
  }

  static createId(): string {
    return this.create().value
  }

  static from(id: string): DashboardId {
    return new DashboardId(id)
  }

  static fromOrCreate(id?: string): DashboardId {
    if (!id) {
      return DashboardId.create()
    }
    return DashboardId.from(id)
  }
}
