import { GetAuthedDataStore } from "$houdini"
import { redirect } from "@sveltejs/kit"
import type { LayoutLoad } from "./$types"

export const ssr = false

export const load: LayoutLoad = async (event) => {
  const me = await event.fetch("/api/me")
  if (me.redirected) {
    redirect(301, me.url)
  }

  event.depends("undb:tables")

  const authedDataStore = new GetAuthedDataStore()
  await authedDataStore.fetch({ event, policy: "NetworkOnly" })

  return {
    authedDataStore,
  }
}
