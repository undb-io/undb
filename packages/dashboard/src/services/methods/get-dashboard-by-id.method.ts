import type { DashboardQueryService } from "../dashboard.query-service"

export async function getDashboardByIdMethod(this: DashboardQueryService, id: string) {
  return this.repo.findOneById(id)
}
