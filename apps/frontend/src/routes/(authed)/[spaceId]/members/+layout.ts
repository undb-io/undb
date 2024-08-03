import { GetMembersStore } from "$houdini"
import type { LayoutLoad } from "./$types"

export const load: LayoutLoad = async (event) => {
  const getMembersStore = new GetMembersStore()
  const q = event.url.searchParams.get("mq")

  const spaceId = event.params.spaceId

  await getMembersStore.fetch({ event, variables: { spaceId, q } })

  return {
    getMembersStore,
  }
}
