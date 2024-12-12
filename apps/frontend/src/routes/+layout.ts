import { Registry } from "$lib/registry.svelte"
import "core-js"
import "reflect-metadata"
import { LayoutLoad } from "./$types"

export const ssr = false
export const prerender = true

export const load: LayoutLoad = async (event) => {
  const registry = new Registry()
  const dataService = await registry.register(false, false)

  return {
    dataService,
  }
}
