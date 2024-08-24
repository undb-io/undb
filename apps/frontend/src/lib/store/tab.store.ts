import { derived } from "svelte/store"
import { queryParam, ssp } from "sveltekit-search-params"

export const tab = queryParam("tab", ssp.string())

export const isDataTab = derived(tab, ($tab) => $tab === "data" || !$tab)
export const isFormTab = derived(tab, ($tab) => $tab === "form")
export const isAuthTab = derived(tab, ($tab) => $tab === "auth")
export const isDeveloperTab = derived(tab, ($tab) => $tab === "developer")

export const formId = queryParam("formId", ssp.string())

export const developerTab = queryParam("dev", ssp.string())
