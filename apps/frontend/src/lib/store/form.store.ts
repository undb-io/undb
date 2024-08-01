import { queryParam, ssp } from "sveltekit-search-params"

export const form = queryParam("form", ssp.string())
