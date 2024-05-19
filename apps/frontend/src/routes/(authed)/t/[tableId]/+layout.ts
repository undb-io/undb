import { GetTableQueryStore } from "$houdini"
import type { LayoutLoad } from "./$types"

export const prerender = "auto"

export const load: LayoutLoad = async (event) => {
  const { tableId } = event.params

  event.depends(`table:${tableId}`)

  const store = new GetTableQueryStore()

  await store.fetch({ event, variables: { tableId } })

  return {
    tableStore: store,
  }
}
