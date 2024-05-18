import { GetTableQueryStore } from "$houdini"
import { trpc } from "$lib/trpc/client"
import { tableCreator } from "@undb/table"
import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"
import type { LayoutLoad } from "./$types"

export const prerender = "auto"

export const load: LayoutLoad = async (event) => {
  const { tableId } = event.params

  event.depends(`table:${tableId}`)
  const table = await trpc.table.get.query({ tableId })

  const t = tableCreator.fromJSON(table)
  // @ts-ignore
  const createRecord = await superValidate(zod(t.schema.valuesSchema))

  return {
    table,
    t: await new GetTableQueryStore().fetch({ event, variables: { tableId } }),
    createRecord,
  }
}
