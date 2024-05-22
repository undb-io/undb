import { TableDo } from "@undb/table"
import { getContext, setContext } from "svelte"
import { writable, type Writable } from "svelte/store"

export function setTable(table: Writable<TableDo>) {
  setContext("table", table)
}

export function getTable() {
  return getContext<Writable<TableDo>>("table")
}
