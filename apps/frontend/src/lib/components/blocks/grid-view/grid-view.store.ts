import { writable } from "svelte/store"

export const editingCell = writable<{ recordId: string; fieldId: string }>(undefined)
