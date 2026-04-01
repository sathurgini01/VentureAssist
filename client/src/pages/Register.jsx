import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import { useAuth } from '../context/AuthContext.jsx'

function Register() {
  const navigate = useNavigate()
  const { login, authLoading } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  })
  const [errors, setErrors] = useState({})

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email)

  const validate = () => {
    const nextErrors = {}

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!validateEmail(formData.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Password is required.'
    }

    if (!formData.confirmPassword.trim()) {
      nextErrors.confirmPassword = 'Please confirm your password.'
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    if (!formData.role) {
      nextErrors.role = 'Role selection is required.'
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

    await login(formData.email, formData.password, formData.role, formData.fullName)

    navigate('/', { replace: true })
  }

  return (
    <div className="auth-shell">
      <div className="auth-card section-stack">
        <div>
          <p className="page-kicker">Create Account</p>
          <h1 className="page-title">Register</h1>
          <p className="page-subtitle">
            Mock signup is ready now and can be swapped to a real registration API later.
          </p>
        </div>
        <Card title="Create your account">
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="register-full-name">Full name</label>
                <input
                  id="register-full-name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`form-control ${errors.fullName ? 'is-invalid' : ''}`.trim()}
                  placeholder="Enter your full name"
                />
                {errors.fullName ? <p className="error-text">{errors.fullName}</p> : null}
              </div>
              <div className="form-group">
                <label htmlFor="register-email">Email</label>
                <input
                  id="register-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`.trim()}
                  placeholder="you@example.com"
                />
                {errors.email ? <p className="error-text">{errors.email}</p> : null}
              </div>
              <div className="form-group">
                <label htmlFor="register-password">Password</label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`.trim()}
                  placeholder="Create a password"
                />
                {errors.password ? <p className="error-text">{errors.password}</p> : null}
              </div>
              <div className="form-group">
                <label htmlFor="register-confirm-password">Confirm password</label>
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`.trim()}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword ? <p className="error-text">{errors.confirmPassword}</p> : null}
              </div>
              <div className="form-group">
                <label htmlFor="register-role">Role</label>
                <select
                  id="register-role"
                  name="role"
                  className={`form-control ${errors.role ? 'is-invalid' : ''}`.trim()}
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">Select a role</option>
                  <option value="user">User</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role ? <p className="error-text">{errors.role}</p> : null}
              </div>
            </div>
            <div className="inline-actions">
              <Button type="submit">
                {authLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
              <Link to="/login">Already have an account?</Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Register
