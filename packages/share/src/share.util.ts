import type { IShareType } from "./share-target.vo"

export const getShareViewUrl = (origin: string, viewId: string) => origin + "/s/v/" + viewId
export const getShareFormUrl = (origin: string, formId: string) => origin + "/s/f/" + formId

export const getShareUrl = (type: IShareType, origin: string, id: string) => {
  switch (type) {
    case "view":
      return getShareViewUrl(origin, id)
    case "form":
      return getShareFormUrl(origin, id)
  }
}

export const getIframe = (url: string) => {
  return `<iframe
  src="${url}"
  frameborder="0"
  width="100%"
  height="700"
  style="background: transparent; border: 1px solid #ddd"></iframe>`
}
