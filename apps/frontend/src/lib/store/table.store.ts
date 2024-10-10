import { page } from "$app/stores"
import type { TableDo } from "@undb/table"
import { getContext,setContext } from "svelte"
import { derived,type Writable } from "svelte/store"

export function setTable(table: Writable<TableDo>) {
  setContext("table", table)
}

export function getTable() {
  return getContext<Writable<TableDo>>("table")
}

export const viewId = derived([page], ([$page]) => $page.params.viewId)
