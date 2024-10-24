import { GetTableQueryStore } from "$houdini"
import { redirect } from "@sveltejs/kit"
import type { LayoutLoad } from "./$types"

export const prerender = "auto"

export const load: LayoutLoad = async (event) => {
  const { tableId } = event.params

  event.depends(`undb:table:${tableId}`)

  const store = new GetTableQueryStore()

  const data = await store.fetch({ event, variables: { tableId }, policy: "NetworkOnly" })
  if (data.errors?.length) {
    throw redirect(302, "/")
  }

  return {
    tableStore: store,
    table: data.data?.table,
  }
}
