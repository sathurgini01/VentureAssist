import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, authLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user',
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

    await login(formData.email, formData.password, formData.role)

    navigate(location.state?.from?.pathname || '/', { replace: true })
  }

  return (
    <div className="auth-shell">
      <div className="auth-card section-stack">
        <div>
          <p className="page-kicker">Welcome Back</p>
          <h1 className="page-title">Login</h1>
          <p className="page-subtitle">
            Sign in with a mock account now, then replace this with the real API later.
          </p>
        </div>
        <Card title="Sign in to Venture Assist">
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
                  placeholder="user@ventureassist.app"
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
              <div className="form-group">
                <label htmlFor="login-role">Role</label>
                <select
                  id="login-role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="user">User</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="inline-actions">
              <Button type="submit">
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
