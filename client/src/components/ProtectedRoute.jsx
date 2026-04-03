import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isInitialized } = useAuth()
  const location = useLocation()

  // Still loading initial auth state
  if (!isInitialized) {
    return (
      <div className="page-placeholder">
        <h1 className="page-title">Checking access</h1>
        <p className="page-subtitle">Preparing your workspace.</p>
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // Check role restrictions
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.map((role) => role.toLowerCase()).includes((user.role ?? '').toLowerCase())
  ) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
