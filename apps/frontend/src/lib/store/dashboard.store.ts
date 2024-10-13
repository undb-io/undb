import type { Dashboard } from "@undb/dashboard"
import { getContext, setContext } from "svelte"
import { type Writable } from "svelte/store"

export function setDashboard(dashboard: Writable<Dashboard>) {
  setContext("dashboard", dashboard)
}

export function getDashboard() {
  return getContext<Writable<Dashboard>>("dashboard")
}
