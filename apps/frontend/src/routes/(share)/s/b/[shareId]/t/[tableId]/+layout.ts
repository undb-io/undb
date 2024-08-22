import { GetBaseTableShareDataStore } from "$houdini"
import type { LayoutLoad } from "./$types"

export const prerender = "auto"

export const load: LayoutLoad = async (event) => {
  const getBaseTableShareData = new GetBaseTableShareDataStore()

  await getBaseTableShareData.fetch({
    event,
    variables: {
      shareId: event.params.shareId,
      tableId: event.params.tableId,
    },
  })

  return {
    getBaseTableShareData,
  }
}
