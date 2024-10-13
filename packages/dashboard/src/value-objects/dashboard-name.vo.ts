import { ValueObject } from "@undb/domain"
import * as z from "@undb/zod"

export const dashboardNameSchema = z.string().min(1, { message: "Dashboard name must be at least 1 character" })

export class DashboardName extends ValueObject<z.infer<typeof dashboardNameSchema>> {
  static from(name: string): DashboardName {
    return new DashboardName({ value: dashboardNameSchema.parse(name) })
  }
}
