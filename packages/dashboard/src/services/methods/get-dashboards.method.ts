import { None, Option, Some } from "@undb/domain"
import { DashboardBaseIdSpecification, type DashboardComositeSpecification } from "../../specifications"
import type { DashboardQueryService } from "../dashboard.query-service"

export async function getDashboardsMethod(this: DashboardQueryService, baseId?: string) {
  let spec: Option<DashboardComositeSpecification> = None

  if (baseId) {
    spec = Some(new DashboardBaseIdSpecification(baseId))
  }

  return this.repo.find(spec)
}
