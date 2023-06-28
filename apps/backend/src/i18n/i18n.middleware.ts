import type { NextFunction, Request, Response } from 'express'
import { type i18n } from 'i18next'
import type { ClsService } from 'nestjs-cls'

export const i18nMiddleware = (cls: ClsService, i18next: i18n) => (req: Request, res: Response, next: NextFunction) => {
  const lang = req.cookies.lng
  cls.set('lang', lang as 'en' | 'zh-CN')
  cls.set('t', i18next.t)
  next()
}
