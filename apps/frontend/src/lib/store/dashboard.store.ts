import type { Dashboard } from "@undb/dashboard"
import { getContext, setContext } from "svelte"
import { derived, get, readable, type Writable } from "svelte/store"
import { createWidgetItems, type WidgetItemsStore } from "./widget.store"

export function setDashboard(dashboard: Writable<Dashboard>) {
  setContext("dashboard", dashboard)
  setDashboardWidgetItemsStore(get(dashboard))
}

export function getDashboard() {
  return getContext<Writable<Dashboard>>("dashboard")
}

export function getIsDashboard() {
  const dashboard = getContext<Writable<Dashboard>>("dashboard")
  if (!dashboard) {
    return readable(false)
  }
  return derived(dashboard, ($dashboard) => !!$dashboard)
}

function setDashboardWidgetItemsStore(dashboard: Dashboard) {
  const widgetItems = createWidgetItems(dashboard)
  setContext("widgetItems", widgetItems)
}

export function getDashboardWidgetItemsStore() {
  return getContext<WidgetItemsStore>("widgetItems")
}
