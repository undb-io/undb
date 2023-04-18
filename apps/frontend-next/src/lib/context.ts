import type { Records, Table, View } from '@undb/core'
import { getContext, setContext } from 'svelte'
import type { Writable } from 'svelte/store'

export const tableKey = Symbol('TABLE')

export const setTable = (table: Writable<Table>) => setContext(tableKey, table)

export const getTable = () => getContext<Writable<Table>>(tableKey)

export const viewKey = Symbol('VIEW')

export const setView = (view: Writable<View>) => setContext(viewKey, view)

export const getView = () => getContext<Writable<View>>(viewKey)

export const recordsKey = Symbol('RECORDS')

export const setRecords = (records: Writable<Records>) => setContext(recordsKey, records)

export const getRecords = () => getContext<Writable<Records>>(recordsKey)
