import { GetBaseQueryStore } from "$houdini"
import type { LayoutLoad } from "./$types"

export const prerender = "auto"

export const load: LayoutLoad = async (event) => {
  const baseId = event.params.baseId
  event.depends(`undb:base:${baseId}`)

  const getBaseStore = new GetBaseQueryStore()
  await getBaseStore.fetch({ event, variables: { baseId }, policy: "NetworkOnly" })

  return {
    getBaseStore,
  }
}
