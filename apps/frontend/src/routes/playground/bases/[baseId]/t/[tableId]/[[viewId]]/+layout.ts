import { getDataService } from "$lib/store/data-service.store"
import { redirect } from "@sveltejs/kit"
import { tryit } from "radash"
import { LayoutLoad } from "./$types"

export const load: LayoutLoad = async (event) => {
  const tableId = event.params.tableId

  event.depends(`undb:table:${tableId}`)

  const dataService = await getDataService(true, true)

  const getTable = tryit(dataService.table.getTable)
  const [err, table] = await getTable({ tableId })

  if (err || !table) {
    throw redirect(302, `/playground`)
  }

  return {
    table,
  }
}