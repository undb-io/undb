import { GetLoginWithOtpSettingsStore } from "$houdini"
import type { LayoutLoad } from "./$types"

export const load: LayoutLoad = async () => {
  const store = new GetLoginWithOtpSettingsStore()

  const data = await store.fetch({ policy: "NetworkOnly" })
  const otpEnabled = !!data.data?.settings?.auth?.otp?.enabled

  return {
    otpEnabled,
  }
}
