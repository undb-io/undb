import { GetBaseTableShareDataStore } from "$houdini"
import type { LayoutLoad } from "./$types"

export const prerender = "auto"

export const load: LayoutLoad = async (event) => {
  const getBaseTableShareData = new GetBaseTableShareDataStore()

  const { shareId, tableId } = event.params

  await getBaseTableShareData.fetch({
    event,
    variables: { shareId, tableId },
  })

  return {
    getBaseTableShareData,
  }
}
