import { writable } from "svelte/store"

export const currentSpaceId = writable<string | undefined>(undefined)
