import { GetTablesQueryStore } from "$houdini"
import type { LayoutLoad } from "./$types"

export const ssr = false

export const load: LayoutLoad = async (event) => {
  event.depends("undb:tables")

  const tablesStore = new GetTablesQueryStore()
  await tablesStore.fetch({ event, policy: "NetworkOnly" })

  return {
    tablesStore,
  }
}
