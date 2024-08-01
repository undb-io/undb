import { queryParam, ssp } from "sveltekit-search-params"

export const fieldId = queryParam("fieldId", ssp.string())
