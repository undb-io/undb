import { format } from 'date-fns/fp'

const dateTimeFormat = format('yyyy-MM-dd hh:mm:ss')

export const DateValue: React.FC<{ value: Date | undefined }> = ({ value }) => {
  if (!value) return null

  return <>{dateTimeFormat(value)}</>
}
