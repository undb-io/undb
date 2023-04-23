import { writable } from 'svelte/store'

export const createTableOpen = writable<boolean>(false)

export const createOptionOpen = writable<boolean>(false)

export const createRecordOpen = writable<boolean>(false)

export const createFieldOpen = writable<boolean>(false)

export const updateFieldOpen = writable<boolean>(false)
