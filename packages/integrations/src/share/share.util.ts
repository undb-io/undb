export const getShareViewUrl = (origin: string, viewId: string) => origin + '/s/v/' + viewId
export const getShareFormUrl = (origin: string, formId: string) => origin + '/s/f/' + formId

export const getIframe = (url: string) => {
  return `<iframe
  src="${url}"
  frameborder="0"
  width="100%"
  height="700"
  style="background: transparent; border: 1px solid #ddd"></iframe>`
}
