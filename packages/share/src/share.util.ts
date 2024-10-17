import { match } from "ts-pattern"
import type { IShareType } from "./share-target.vo"

export const getShareViewUrl = (origin: string, shareId: string) => origin + "/s/v/" + shareId
export const getShareFormUrl = (origin: string, shareId: string) => origin + "/s/f/" + shareId
export const getShareTableUrl = (origin: string, shareId: string) => origin + "/s/t/" + shareId
export const getShareBaseUrl = (origin: string, shareId: string) => origin + "/s/b/" + shareId
export const getShareDashboardUrl = (origin: string, shareId: string) => origin + "/s/d/" + shareId

export const getShareUrl = (type: IShareType, origin: string, id: string) => {
  return match(type)
    .with("view", () => getShareViewUrl(origin, id))
    .with("form", () => getShareFormUrl(origin, id))
    .with("table", () => getShareTableUrl(origin, id))
    .with("base", () => getShareBaseUrl(origin, id))
    .with("dashboard", () => getShareDashboardUrl(origin, id))
    .exhaustive()
}

export const getIframe = (url: string) => {
  return `<iframe
  src="${url}"
  frameborder="0"
  width="100%"
  height="700"
  style="background: transparent; border: 1px solid #ddd"></iframe>`
}
