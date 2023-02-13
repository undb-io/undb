import type { IDateRangeFieldValue } from '@egodb/core'
import { format } from 'date-fns/fp'

const dateFormat = format('yyyy-MM-dd')

export const DateRangeValue: React.FC<{ value: IDateRangeFieldValue | undefined }> = ({ value }) => {
  if (!value) return null

  const [from, to] = value
  if (from && to) {
    return <>{`${dateFormat(from)} - ${dateFormat(to)}`}</>
  }

  if (from) {
    return <>{dateFormat(from)}</>
  }

  if (to) {
    return <>{dateFormat(to)}</>
  }
  return null
}
