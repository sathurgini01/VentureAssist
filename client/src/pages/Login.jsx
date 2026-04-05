import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, authLoading, authError } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const nextErrors = {}

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.'
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Password is required.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    try {
      const user = await login(formData.email, formData.password)
      const normalizedRole = String(user?.role || '').trim().toLowerCase()

      if (normalizedRole === 'admin') {
        navigate('/admin/dashboard', { replace: true })
      } else if (normalizedRole === 'mentor') {
        navigate('/', { replace: true })
      } else {
        navigate(location.state?.from?.pathname || '/', { replace: true })
      }
    } catch (error) {
      // Error is already stored in authError state
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card section-stack">
        <div>
          <p className="page-kicker">Welcome Back</p>
          <h1 className="page-title">Login</h1>
          <p className="page-subtitle">
            Sign in to your Venture Assist account to continue.
          </p>
        </div>
        <Card title="Sign in to Venture Assist">
          {authError && (
            <div className="auth-error-banner">
              <p className="error-text">{authError}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="login-email">Email</label>
                <input
                  id="login-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`.trim()}
                  placeholder="you@example.com"
                />
                {errors.email ? <p className="error-text">{errors.email}</p> : null}
              </div>
              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`.trim()}
                  placeholder="Enter password"
                />
                {errors.password ? <p className="error-text">{errors.password}</p> : null}
              </div>
            </div>
            <div className="inline-actions">
              <Button type="submit" disabled={authLoading}>
                {authLoading ? 'Signing In...' : 'Login'}
              </Button>
              <Link to="/register">Create an account</Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Login
