import { GetDashboardByShareStore } from "$houdini"
import { redirect } from "@sveltejs/kit"
import type { LayoutLoad } from "./$types"

export const prerender = "auto"

export const load: LayoutLoad = async (event) => {
  const { shareId } = event.params

  event.depends(`undb:dashboard:${shareId}`)

  const store = new GetDashboardByShareStore()

  const data = await store.fetch({ event, variables: { shareId }, policy: "NetworkOnly" })

  if (data.errors?.length) {
    throw redirect(302, "/")
  }

  return {
    dashboardStore: store,
  }
}
