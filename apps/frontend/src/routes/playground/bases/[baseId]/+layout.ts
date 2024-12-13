import { redirect } from "@sveltejs/kit"
import { tryit } from "radash"
import { LayoutLoad } from "./$types"

export const load: LayoutLoad = async (event) => {
  const baseId = event.params.baseId

  const dataService = (await event.parent()).dataService

  const getBase = tryit(dataService.base.getBase)
  const [err, base] = await getBase({ baseId })

  if (!base || err) {
    throw redirect(302, "/playground")
  }

  const [tables, dashboards] = await Promise.all([
    dataService.table.getTables({ baseId }),
    dataService.dashboard.getDashboards({ baseId }),
  ])

  return {
    base,
    tables,
    dashboards,
  }
}
