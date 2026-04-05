import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import { useAuth } from '../context/AuthContext.jsx'

function Register() {
  const navigate = useNavigate()
  const { register, authLoading, authError } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email)

  const validate = () => {
    const nextErrors = {}

    if (!formData.name.trim()) {
      nextErrors.name = 'Full name is required.'
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
      await register(formData.name, formData.email, formData.password)
      navigate('/', { replace: true })
    } catch (error) {
      // Error is already stored in authError state
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card section-stack">
        <div>
          <p className="page-kicker">Create Account</p>
          <h1 className="page-title">Register</h1>
          <p className="page-subtitle">
            Create a Venture Assist account to get started.
          </p>
        </div>
        <Card title="Create your account">
          {authError && (
            <div className="auth-error-banner">
              <p className="error-text">{authError}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="register-name">Full name</label>
                <input
                  id="register-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`.trim()}
                  placeholder="Enter your full name"
                />
                {errors.name ? <p className="error-text">{errors.name}</p> : null}
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
            </div>
            <div className="inline-actions">
              <Button type="submit" disabled={authLoading}>
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
