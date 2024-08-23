import { GetIndexQueryStore } from "$houdini"
import type { LayoutLoad } from "./$types"

export const ssr = false

export const load: LayoutLoad = async (event) => {
  event.depends("undb:tables")

  const indexDataStore = new GetIndexQueryStore()
  await indexDataStore.fetch({ event, policy: "NetworkOnly" })

  return {
    indexDataStore,
  }
}
