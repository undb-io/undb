import { queryParam, ssp } from "sveltekit-search-params"

export const tab = queryParam("tab", ssp.string())
