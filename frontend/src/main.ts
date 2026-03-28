// ShelterMap Frontend Entry Point

import './style.css'
import { initializeSupabase } from './lib/supabase'
import { registerServiceWorker } from './lib/serviceWorker'
import { isAuthenticated, getUsername, logout } from './components/Login'

// Initialize Supabase client
const supabase = initializeSupabase()

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  registerServiceWorker()
}

// Update header with user info
function updateHeader() {
  const header = document.querySelector('header')
  if (!header) return

  const nav = header.querySelector('nav')
  if (!nav) return

  // Remove existing user info if any
  const existingUserInfo = header.querySelector('.user-info')
  if (existingUserInfo) {
    existingUserInfo.remove()
  }

  // Add user info if authenticated
  if (isAuthenticated()) {
    const username = getUsername()
    const userInfo = document.createElement('div')
    userInfo.className = 'user-info'
    userInfo.innerHTML = `
      <span class="username">👤 ${username}</span>
      <button class="logout-btn" id="logout-btn">Logout</button>
    `
    header.appendChild(userInfo)

    // Add logout handler
    const logoutBtn = document.getElementById('logout-btn')
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        logout()
        window.history.pushState({}, '', '/login')
        router()
      })
    }
  }
}

// Simple router
function router() {
  const path = window.location.pathname
  const mainContent = document.getElementById('main-content')
  
  if (!mainContent) return

  // Update header
  updateHeader()

  // Check authentication for admin routes
  if (path === '/admin' && !isAuthenticated()) {
    window.history.pushState({}, '', '/login')
    renderLoginPage()
    return
  }

  if (path === '/login') {
    renderLoginPage()
  } else if (path === '/' || path === '/map') {
    mainContent.innerHTML = `
      <div class="map-container">
        <div class="map-header">
          <h2>Live Shelter Map</h2>
          <p>Real-time evacuation center capacity monitoring</p>
        </div>
        <div id="map" style="height: 600px;"></div>
        <div class="legend">
          <div class="legend-item">
            <div class="legend-dot" style="background-color: #10b981;"></div>
            <span>Available (&lt;70%)</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot" style="background-color: #f59e0b;"></div>
            <span>Limited (70-89%)</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot" style="background-color: #ef4444;"></div>
            <span>Full (≥90%)</span>
          </div>
        </div>
      </div>
    `
    import('./components/MapView').then(({ initializeMap }) => {
      initializeMap('map', supabase)
    })
  } else if (path === '/coordinator') {
    mainContent.innerHTML = '<div id="coordinator-form"></div>'
    import('./components/CoordinatorUpdateForm').then(({ renderCoordinatorForm }) => {
      renderCoordinatorForm('coordinator-form', supabase)
    })
  } else if (path === '/admin') {
    mainContent.innerHTML = '<div id="admin-dashboard"></div>'
    import('./components/AdminDashboard').then(({ renderAdminDashboard }) => {
      renderAdminDashboard('admin-dashboard', supabase)
    })
  } else {
    mainContent.innerHTML = `
      <div class="form-container" style="text-align: center;">
        <h2>404 - Page Not Found</h2>
        <p style="margin: 1rem 0; color: var(--text-light);">The page you're looking for doesn't exist.</p>
        <a href="/" style="color: var(--primary-color); text-decoration: none; font-weight: 600;">← Back to Map</a>
      </div>
    `
  }
}

function renderLoginPage() {
  const mainContent = document.getElementById('main-content')
  if (!mainContent) return

  mainContent.innerHTML = '<div id="login-container"></div>'
  
  import('./components/Login').then(({ renderLogin }) => {
    renderLogin('login-container', (username) => {
      console.log(`User ${username} logged in`)
      window.history.pushState({}, '', '/admin')
      router()
    })
  })
}

// Handle navigation
window.addEventListener('popstate', router)
document.addEventListener('DOMContentLoaded', router)

// Handle link clicks
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement
  if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('/')) {
    e.preventDefault()
    const href = target.getAttribute('href')!
    window.history.pushState({}, '', href)
    router()
  }
})

console.log('ShelterMap initialized')
