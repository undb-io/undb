import { writable } from 'svelte/store'

export const createTableHidden = writable<boolean>(true)

export const createOptionOpen = writable<boolean>(false)

export const createRecordOpen = writable<boolean>(false)
