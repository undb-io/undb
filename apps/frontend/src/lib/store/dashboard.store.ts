import type { Dashboard } from "@undb/dashboard"
import { getContext, setContext } from "svelte"
import { derived, type Writable } from "svelte/store"

export function setDashboard(dashboard: Writable<Dashboard>) {
  setContext("dashboard", dashboard)
}

export function getDashboard() {
  return getContext<Writable<Dashboard>>("dashboard")
}

export function getIsDashboard() {
  const dashboard = getContext<Writable<Dashboard>>("dashboard")
  return derived(dashboard, ($dashboard) => !!$dashboard)
}
