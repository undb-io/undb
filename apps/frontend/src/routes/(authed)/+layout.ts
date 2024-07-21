import { GetIndexQueryStore } from "$houdini"
import { redirect } from "@sveltejs/kit"
import type { LayoutLoad } from "./$types"

export const ssr = false

export const load: LayoutLoad = async (event) => {
  const me = await event.fetch("/api/me")
  if (me.redirected) {
    redirect(301, me.url)
  }

  event.depends("undb:tables")

  const indexDataStore = new GetIndexQueryStore()
  await indexDataStore.fetch({ event, policy: "NetworkOnly" })

  return {
    me: await me.json(),
    indexDataStore,
  }
}
