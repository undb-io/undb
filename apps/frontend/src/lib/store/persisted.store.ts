import { persisted } from "svelte-persisted-store"

export const preferences = persisted("undb_preferences", {
  showAudit: false,
})
