import { DataService } from "@undb/data-service"
import { getContext, setContext } from "svelte"

const IS_LOCAL = "IS_LOCAL"

export function setIsLocal(isLocal: boolean) {
  setContext(IS_LOCAL, isLocal)
}

export function getIsLocal() {
  return getContext<boolean>(IS_LOCAL) ?? false
}

const DATA_SERVICE = "DATA_SERVICE"

export function setDataService(dataService: DataService) {
  setContext(DATA_SERVICE, dataService)
}

export function getDataService() {
  return getContext<DataService>(DATA_SERVICE)
}
