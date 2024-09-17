import { redirect } from "@sveltejs/kit"
import type { LayoutLoad } from "./$types"

export const ssr = false

export const load: LayoutLoad = async (event) => {
  // const redirectURL = encodeURIComponent(event.url.pathname)

  // const search = new URLSearchParams({ redirect: redirectURL })

  const me = await event.fetch("/api/me")
  if (me.redirected) {
    throw redirect(301, me.url)
  }

  return {
    me: await me.json(),
  }
}
