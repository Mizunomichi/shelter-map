// Login component for admin authentication

export function renderLogin(containerId: string, onLoginSuccess: (username: string) => void) {
  const container = document.getElementById(containerId)
  if (!container) return

  container.innerHTML = `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="login-icon">🔐</div>
          <h2>Admin Login</h2>
          <p>Enter your credentials to access the admin dashboard</p>
        </div>
        
        <form id="login-form">
          <div id="error-container"></div>
          
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              placeholder="Enter your username"
              required 
              autocomplete="username"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Enter your password"
              required 
              autocomplete="current-password"
            />
          </div>
          
          <button type="submit" id="login-btn">
            Sign In
          </button>
        </form>
        
        <div style="margin-top: 1.5rem; text-align: center; font-size: 0.875rem; color: var(--text-light);">
          <p>Demo Credentials:</p>
          <p style="margin-top: 0.5rem;">
            <strong>Username:</strong> Admin<br>
            <strong>Password:</strong> 12345
          </p>
        </div>
      </div>
    </div>
  `

  const form = document.getElementById('login-form') as HTMLFormElement
  const errorContainer = document.getElementById('error-container')!
  const loginBtn = document.getElementById('login-btn') as HTMLButtonElement

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const username = (document.getElementById('username') as HTMLInputElement).value
    const password = (document.getElementById('password') as HTMLInputElement).value
    
    // Clear previous errors
    errorContainer.innerHTML = ''
    
    // Disable button during login
    loginBtn.disabled = true
    loginBtn.textContent = 'Signing in...'
    
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Simple authentication check
    if (username === 'Admin' && password === '12345') {
      // Store session
      sessionStorage.setItem('isAuthenticated', 'true')
      sessionStorage.setItem('username', username)
      
      // Show success message briefly
      errorContainer.innerHTML = `
        <div class="success-message">
          ✓ Login successful! Redirecting...
        </div>
      `
      
      // Redirect after short delay
      setTimeout(() => {
        onLoginSuccess(username)
      }, 800)
    } else {
      // Show error
      errorContainer.innerHTML = `
        <div class="error-message">
          ✗ Invalid username or password. Please try again.
        </div>
      `
      
      // Re-enable button
      loginBtn.disabled = false
      loginBtn.textContent = 'Sign In'
      
      // Clear password field
      ;(document.getElementById('password') as HTMLInputElement).value = ''
    }
  })
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem('isAuthenticated') === 'true'
}

export function getUsername(): string | null {
  return sessionStorage.getItem('username')
}

export function logout() {
  sessionStorage.removeItem('isAuthenticated')
  sessionStorage.removeItem('username')
}
