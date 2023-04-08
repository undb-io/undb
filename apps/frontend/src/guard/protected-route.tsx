import { getIsAuthorized } from '@undb/store'
import { useSelector } from 'react-redux'
import { Navigate, createSearchParams, useLocation } from 'react-router-dom'

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAutorhized = useSelector(getIsAuthorized)
  const location = useLocation()
  if (!isAutorhized) {
    return (
      <Navigate
        to={{ pathname: '/login', search: `?${createSearchParams({ redirectUrl: location.pathname })}` }}
        replace
      />
    )
  }

  return <>{children}</>
}
