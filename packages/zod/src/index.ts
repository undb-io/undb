import i18next from "i18next"
import { z } from "zod"
import { zodI18nMap } from "zod-i18n-map"
import en from "zod-i18n-map/locales/en/zod.json"
import zhCN from "zod-i18n-map/locales/zh-CN/zod.json"

// lng and resources key depend on your locale.
i18next.init({
  lng: "en",
  resources: {
    en: { zod: en },
    "zh-CN": { zod: zhCN },
  },
})
z.setErrorMap(zodI18nMap)

// export configured zod instance

export * from "zod"
export { fromError } from "zod-validation-error"
export { z }
