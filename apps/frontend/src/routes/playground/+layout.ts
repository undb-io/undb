import { Registry } from "$lib/registry.svelte"
import { LayoutLoad } from "./$types"

export const prerender = "auto"

export const load: LayoutLoad = async (event) => {
  event.depends("undb:playground")

  const dataService = await new Registry().register(true, true)

  const me = await event.fetch("/api/me")

  const bases = await dataService.base.listBases()

  return {
    bases,
    dataService,
    me: me.redirected ? null : await me.json(),
  }
}
