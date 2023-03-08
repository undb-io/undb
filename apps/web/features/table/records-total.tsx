import { getCurrentTableRecordsTotal } from '@egodb/store'
import { useAppSelector } from '../../hooks'

export const RecordsTotal: React.FC = () => {
  const total = useAppSelector(getCurrentTableRecordsTotal)

  return <>{total}</>
}
