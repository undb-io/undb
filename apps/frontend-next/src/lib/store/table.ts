import type { Field } from '@undb/core'
import { writable } from 'svelte/store'

export const currentField = writable<Field | null>(null)
