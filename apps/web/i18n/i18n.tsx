import { DatesProvider } from '@egodb/ui'
import i18n from './client'
import 'dayjs/locale/zh-cn'

export const I18n: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <DatesProvider settings={{ locale: i18n.language }}>{children}</DatesProvider>
}
