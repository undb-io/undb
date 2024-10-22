import { GetDashboardQueryStore } from "$houdini"
import { redirect } from "@sveltejs/kit"
import type { LayoutLoad } from "./$types"

export const prerender = "auto"

export const load: LayoutLoad = async (event) => {
  const { dashboardId } = event.params

  event.depends(`undb:dashboard:${dashboardId}`)

  const store = new GetDashboardQueryStore()

  const data = await store.fetch({ event, variables: { dashboardId }, policy: "NetworkOnly" })

  if (data.errors?.length) {
    throw redirect(302, "/")
  }

  return {
    dashboardStore: store,
  }
}
