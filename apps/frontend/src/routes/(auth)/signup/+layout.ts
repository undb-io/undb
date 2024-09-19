import { GetSignupSettingsStore } from "$houdini"
import { redirect } from "@sveltejs/kit"
import type { LayoutLoad } from "./$types"

export const load: LayoutLoad = async () => {
  const store = new GetSignupSettingsStore()

  const data = await store.fetch({ policy: "NetworkOnly" })

  const registrationEnabled = !!data.data?.settings?.registration?.enabled
  if (!registrationEnabled) {
    throw redirect(302, "/login")
  }

  return {
    registrationEnabled,
    oauth: data.data?.settings?.oauth,
  }
}
