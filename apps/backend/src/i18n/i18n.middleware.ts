import { NextFunction, Request, Response } from 'express'
import { type i18n } from 'i18next'
import { ClsService } from 'nestjs-cls'

export const i18nMiddleware = (cls: ClsService, i18next: i18n) => (req: Request, res: Response, next: NextFunction) => {
  console.log(req.language)
  cls.set('lang', req.language as 'en' | 'zh-CN')
  cls.set('t', i18next.t)
  next()
}
