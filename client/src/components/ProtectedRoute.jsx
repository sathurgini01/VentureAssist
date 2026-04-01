import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, authLoading } = useAuth()
  const location = useLocation()

  if (authLoading) {
    return (
      <div className="page-placeholder">
        <h1 className="page-title">Checking access</h1>
        <p className="page-subtitle">Preparing your workspace.</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.map((role) => role.toLowerCase()).includes((user.role ?? '').toLowerCase())
  ) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
