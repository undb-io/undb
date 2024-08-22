import { GetFormShareDataStore } from "$houdini"
import type { LayoutLoad } from "./$types"

export const prerender = "auto"

export const load: LayoutLoad = async (event) => {
  const getFormShareData = new GetFormShareDataStore()

  await getFormShareData.fetch({ event, variables: { shareId: event.params.shareId } })

  return {
    getFormShareData,
  }
}
