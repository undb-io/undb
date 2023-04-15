import { useParams } from 'react-router-dom'
import { UpdateRecordFormDrawer } from '../features/update-record-form/update-record-form-drawer'

export const Record: React.FC = () => {
  const { recordId } = useParams()
  if (!recordId) return null

  return <UpdateRecordFormDrawer recordId={recordId} />
}
