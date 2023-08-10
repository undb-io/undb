import type { IRoles } from '@undb/authz'
import type { IQueryUser } from '@undb/core'
import { writable } from 'svelte/store'

export const me = writable<IQueryUser>()

export const role = writable<IRoles>()
