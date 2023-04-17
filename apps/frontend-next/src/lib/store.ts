import { writable } from 'svelte/store'

export const createTableHidden = writable<boolean>(true)
