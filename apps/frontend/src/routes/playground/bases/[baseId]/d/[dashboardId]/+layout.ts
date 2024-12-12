import { redirect } from "@sveltejs/kit"
import { tryit } from "radash"
import { LayoutLoad } from "./$types"

export const prerender = false

export const load: LayoutLoad = async (event) => {
  const { dashboardId } = event.params

  event.depends(`undb:dashboard:${dashboardId}`)

  const dataService = (await event.parent()).dataService
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
