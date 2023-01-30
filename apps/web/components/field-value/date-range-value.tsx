import type { IDateRangeFieldValue } from '@egodb/core'
import { format } from 'date-fns/fp'

const dateFormat = format('yyyy-MM-dd')

export const DateRangeValue: React.FC<{ value: IDateRangeFieldValue | undefined }> = ({ value }) => {
  if (!value) return null

  return <>{`${dateFormat(value[0])} - ${dateFormat(value[1])}`}</>
}
