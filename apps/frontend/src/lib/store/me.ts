import type { IQueryUser } from '@undb/core'
import { writable } from 'svelte/store'

export const me = writable<IQueryUser>()
