import { getIsAuthorized } from '@egodb/store'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAutorhized = useSelector(getIsAuthorized)
  if (!isAutorhized) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
