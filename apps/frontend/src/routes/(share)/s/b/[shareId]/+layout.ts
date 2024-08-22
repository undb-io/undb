import { GetShareBaseDataStore } from "$houdini"
import type { LayoutLoad } from "./$types"

export const prerender = "auto"

export const load: LayoutLoad = async (event) => {
  const shareId = event.params.shareId
  event.depends(`undb:base:${shareId}`)

  const getShareBaseStore = new GetShareBaseDataStore()
  await getShareBaseStore.fetch({ event, variables: { shareId }, policy: "NetworkOnly" })

  return {
    getShareBaseStore,
  }
}
