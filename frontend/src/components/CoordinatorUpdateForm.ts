// CoordinatorUpdateForm component - PIN-authenticated occupancy updates

import { SupabaseClient } from '@supabase/supabase-js'
import { Shelter } from '../lib/supabase'
import { enqueueOfflineSubmission, getQueuedCount } from '../lib/serviceWorker'

export async function renderCoordinatorForm(containerId: string, supabase: SupabaseClient) {
  const container = document.getElementById(containerId)
  if (!container) return

  // Fetch shelters for dropdown
  const { data: shelters, error } = await supabase
    .from('public_shelters')
    .select('id, name')
    .eq('is_active', true)

  if (error) {
    container.innerHTML = '<p>Error loading shelters</p>'
    return
  }

  const queuedCount = await getQueuedCount()

  container.innerHTML = `
    <div class="form-container">
      <h2>Update Shelter Occupancy</h2>
      ${queuedCount > 0 ? `<p style="color: #f59e0b; font-weight: 600;">⚠️ ${queuedCount} update(s) pending sync</p>` : ''}
      
      <form id="coordinator-form">
        <div class="form-group">
          <label for="shelter-select">Shelter</label>
          <select id="shelter-select" required>
            <option value="">Select a shelter...</option>
            ${shelters?.map((s: Shelter) => `<option value="${s.id}">${s.name}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label for="pin-input">Coordinator PIN</label>
          <input 
            type="password" 
            id="pin-input" 
            placeholder="Enter 4-8 digit PIN" 
            pattern="\\d{4,8}"
            required 
          />
        </div>

        <div class="form-group">
          <label for="occupancy-input">Current Occupancy</label>
          <input 
            type="number" 
            id="occupancy-input" 
            min="0" 
            placeholder="Enter current headcount" 
            required 
          />
        </div>

        <div id="form-message" style="margin-bottom: 1rem;"></div>

        <button type="submit" id="submit-btn">Submit Update</button>
      </form>
    </div>
  `

  const form = document.getElementById('coordinator-form') as HTMLFormElement
  const messageDiv = document.getElementById('form-message')!
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const shelterId = (document.getElementById('shelter-select') as HTMLSelectElement).value
    const pin = (document.getElementById('pin-input') as HTMLInputElement).value
    const occupancy = parseInt((document.getElementById('occupancy-input') as HTMLInputElement).value)

    if (!shelterId || !pin || isNaN(occupancy)) {
      showMessage('Please fill all fields', 'error')
      return
    }

    submitBtn.disabled = true
    submitBtn.textContent = 'Submitting...'

    try {
      // Check if online
      if (!navigator.onLine) {
        // Queue for offline sync
        await enqueueOfflineSubmission(shelterId, pin, occupancy)
        showMessage('Update queued for sync when online', 'success')
        form.reset()
        const newCount = await getQueuedCount()
        updateQueuedCount(newCount)
      } else {
        // Submit online
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-shelter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            shelter_id: shelterId,
            pin,
            current_occupancy: occupancy
          })
        })

        const result = await response.json()

        if (response.ok && result.success) {
          showMessage('Update submitted successfully!', 'success')
          form.reset()
        } else {
          showMessage(result.error || 'Update failed', 'error')
        }
      }
    } catch (error) {
      console.error('Submission error:', error)
      showMessage('Network error - update queued for sync', 'warning')
      await enqueueOfflineSubmission(shelterId, pin, occupancy)
      form.reset()
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = 'Submit Update'
    }
  })

  function showMessage(text: string, type: 'success' | 'error' | 'warning') {
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b'
    }
    messageDiv.innerHTML = `<p style="color: ${colors[type]}; font-weight: 600;">${text}</p>`
    setTimeout(() => {
      messageDiv.innerHTML = ''
    }, 5000)
  }

  function updateQueuedCount(count: number) {
    const existingMsg = container.querySelector('p[style*="color: #f59e0b"]')
    if (existingMsg) {
      if (count > 0) {
        existingMsg.textContent = `⚠️ ${count} update(s) pending sync`
      } else {
        existingMsg.remove()
      }
    }
  }
}
