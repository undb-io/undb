import { derived } from "svelte/store"
import { queryParam, ssp } from "sveltekit-search-params"

export const tab = queryParam("tab", ssp.string())

export const isFormTab = derived(tab, ($tab) => $tab === "form")

export const formId = queryParam("formId", ssp.string())

export const developerTab = queryParam("dev", ssp.string())
