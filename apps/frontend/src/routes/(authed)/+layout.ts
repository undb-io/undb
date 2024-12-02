import { redirect } from "@sveltejs/kit"
import type { LayoutLoad } from "./$types"

export const ssr = false

export const load: LayoutLoad = async (event) => {
  // const redirectURL = encodeURIComponent(event.url.pathname)

  // const search = new URLSearchParams({ redirect: redirectURL })

  // const qb = await createSqljsQueryBuilder()
  // await qb
  //   .insertInto("undb_user")
  //   .values({
  //     id: "1",
  //     email: "test@test.com",
  //     password: "password",
  //     username: "test",
  //   })
  //   .execute()
  // const users = await qb.selectFrom("undb_user").selectAll().execute()
  // console.log({ users })

  const me = await event.fetch("/api/me")
  if (me.redirected) {
    throw redirect(301, me.url)
  }

  return {
    me: await me.json(),
  }
}
