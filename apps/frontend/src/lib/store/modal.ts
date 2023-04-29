import type { ICreateFieldSchema, RecordValueJSON } from '@undb/core'
import { writable } from 'svelte/store'

export const createTableOpen = writable<boolean>(false)
export const updateTableOpen = writable<boolean>(false)
export const createViewOpen = writable<boolean>(false)
export const configViewOpen = writable<boolean>(false)

export const createOptionOpen = writable<boolean>(false)

export const createRecordOpen = writable<boolean>(false)
export const createRecordInitial = writable<RecordValueJSON | undefined>()

export const createFieldOpen = writable<boolean>(false)
export const createFieldInitial = writable<Partial<ICreateFieldSchema> | undefined>()

export const updateFieldOpen = writable<boolean>(false)
