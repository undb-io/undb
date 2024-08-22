import { GetViewShareDataStore } from "$houdini"
import type { LayoutLoad } from "./$types"

export const prerender = "auto"

export const load: LayoutLoad = async (event) => {
  const getViewShareData = new GetViewShareDataStore()

  await getViewShareData.fetch({ event, variables: { shareId: event.params.shareId } })

  return {
    getViewShareData,
  }
}
