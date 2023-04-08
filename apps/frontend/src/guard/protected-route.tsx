import { getIsAuthorized } from '@egodb/store'
import { useSelector } from 'react-redux'
import { Navigate, createSearchParams } from 'react-router-dom'

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAutorhized = useSelector(getIsAuthorized)
  const href = window.location.href
  if (!isAutorhized) {
    return <Navigate to={{ pathname: '/login', search: `?${createSearchParams({ redirectUrl: href })}` }} replace />
  }

  return <>{children}</>
}
