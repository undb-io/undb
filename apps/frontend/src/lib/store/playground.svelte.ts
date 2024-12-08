import { getContext, setContext } from "svelte"

const IS_PLAYGROUND = "IS_PLAYGROUND"

export function setIsPlayground(isPlayground: boolean) {
  setContext(IS_PLAYGROUND, isPlayground)
}

export function getIsPlayground() {
  return getContext<boolean>(IS_PLAYGROUND) ?? false
}
