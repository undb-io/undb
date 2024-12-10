import { page } from "$app/stores"
import type { GetIndexQuery$result } from "$houdini"
import { derived, writable } from "svelte/store"
import { queryParam, ssp } from "sveltekit-search-params"

export const baseId = queryParam("baseId", ssp.string(), { pushHistory: false })

export const bases = writable<GetIndexQuery$result["bases"]>()

export const currentBase = derived([bases, baseId, page], ([$bases, $baseId, $page]) => {
  const baseId = $page.params.baseId ?? $baseId
  return $bases?.find((base) => base?.id === baseId) ?? null
})

export const currentBaseId = derived([page, baseId], ([$page, $baseId]) => {
  return $page.params.baseId ?? $baseId ?? null
})

export const getBaseById = derived([bases], ([$bases]) => {
  return (baseId: string) => $bases?.find((base) => base?.id === baseId) ?? null
})
