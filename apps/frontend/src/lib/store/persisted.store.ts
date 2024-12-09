import { persisted } from "svelte-persisted-store"

export const preferences = persisted("undb_preferences", {
  showAudit: false,
  showHiddenFields: false,
  duplicateFieldIncludeData: true,
  gridViewPerPage: 50,
  panelLeftWidth: 20,
  panelLeftCollapsed: false,
  playgroundModeDismissed: false,
})

interface LastViewed {
  tableId: string
  viewId?: string
}

export const lastViewedTable = persisted<Record<string, LastViewed>>("undb_last_viewed_table", {})
