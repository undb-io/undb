import type { LayoutLoad } from "./$types"

export const load: LayoutLoad = async ({ fetch }) => {
  const fetchMe = await fetch("/api/me")

  const me = fetchMe.redirected ? null : await fetchMe.json()

  return {
    me,
  }
}
