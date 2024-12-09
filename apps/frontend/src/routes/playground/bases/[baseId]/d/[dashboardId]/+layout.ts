import { getDataService } from "$lib/store/data-service.store"
import { redirect } from "@sveltejs/kit"
import { tryit } from "radash"
import { LayoutLoad } from "./$types"

export const prerender = false

export const load: LayoutLoad = async ({ params, depends }) => {
  const { dashboardId } = params

  depends(`undb:dashboard:${dashboardId}`)

  const dataService = await getDataService(true, true)
  const getDashboardById = tryit(dataService.dashboard.getDashboardById)
  const [err, dashboard] = await getDashboardById({
    id: dashboardId,
  })

  if (err || !dashboard) {
    throw redirect(302, "/playground")
  }

  return {
    dashboard,
  }
}
