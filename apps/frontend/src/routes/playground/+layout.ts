import { getDataService } from "$lib/store/data-service.store"
import { LayoutLoad } from "./$types"

export const prerender = "auto"

export const load: LayoutLoad = async ({ depends }) => {
  depends("undb:playground")

  const dataService = await getDataService(true, true)
  const bases = await dataService.base.listBases()

  return {
    bases,
  }
}
