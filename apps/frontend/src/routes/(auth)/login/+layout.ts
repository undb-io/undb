import { GetLoginSettingsStore } from "$houdini"
import type { LayoutLoad } from "./$types"

export const load: LayoutLoad = async () => {
  const store = new GetLoginSettingsStore()

  const data = await store.fetch({ policy: "NetworkOnly" })
  const registrationEnabled = !!data.data?.settings?.registration?.enabled

  return {
    registrationEnabled,
    oauth: data.data?.settings?.oauth,
  }
}
