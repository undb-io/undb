import { GetMembersStore } from "$houdini"
import type { LayoutLoad } from "./$types"

export const load: LayoutLoad = async (event) => {
  const getMembersStore = new GetMembersStore()

  await getMembersStore.fetch({ event })

  return {
    getMembersStore,
  }
}
