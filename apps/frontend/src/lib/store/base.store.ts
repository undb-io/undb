import type { GetIndexQuery$result } from "$houdini"
import { derived, writable } from "svelte/store"
import { queryParam, ssp } from "sveltekit-search-params"

export const baseId = queryParam("baseId", ssp.string())

export const bases = writable<GetIndexQuery$result["bases"]>()

export const currentBase = derived([bases, baseId], ([$bases, $baseId]) => {
  return $bases?.find((base) => base?.id === $baseId) ?? null
})
