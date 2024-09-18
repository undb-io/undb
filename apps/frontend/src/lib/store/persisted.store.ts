import { persisted } from "svelte-persisted-store"

export const preferences = persisted("undb_preferences", {
  showAudit: false,
  showHiddenFields: false,
  duplicateFieldIncludeData: true,
  gridViewPerPage: 50,
  panelLeftWidth: 20,
})
