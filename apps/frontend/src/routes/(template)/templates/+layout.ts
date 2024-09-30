import type { LayoutLoad } from "./$types"

export const load: LayoutLoad = async ({ fetch, depends }) => {
  depends("undb:template")

  const fetchMe = await fetch("/api/me")

  const me = fetchMe.redirected ? null : await fetchMe.json()

  return {
    me,
  }
}
