import type { Provider } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import i18next from 'i18next'

export const I18NEXT = Symbol('I18NEXT')

export const InjectI18Next = () => Inject(I18NEXT)

export const i18nextProvider: Provider = {
  provide: I18NEXT,
  useValue: i18next,
}
