import { registry } from "$lib/registry.svelte"
import { getDataService as getDataServiceImpl } from "@undb/data-service"
import { getContext, setContext } from "svelte"

const IS_LOCAL = "IS_LOCAL"

export function setIsLocal(isLocal: boolean) {
  setContext(IS_LOCAL, isLocal)
}

export function getIsLocal() {
  return getContext<boolean>(IS_LOCAL) ?? false
}

export async function getDataService(isLocal: boolean) {
  await registry.register(isLocal)
  return getDataServiceImpl(isLocal)
}
