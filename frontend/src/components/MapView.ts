// MapView component - Leaflet map with real-time shelter markers

import L from 'leaflet'
import { SupabaseClient } from '@supabase/supabase-js'
import { Shelter } from '../lib/supabase'

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

let map: L.Map | null = null
const markers: Map<string, L.Marker> = new Map()

// Mock data for demo purposes (when Supabase is not available)
const mockShelters: Shelter[] = [
  // Metro Manila Shelters (6)
  {
    id: '1',
    name: 'Barangay Hall Evacuation Center',
    address: '123 Main St, Manila',
    region: 'NCR',
    latitude: 14.5995,
    longitude: 120.9842,
    max_capacity: 200,
    current_occupancy: 50,
    coordinator_phone: '+639171234567',
    status: 'GREEN',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'City Sports Complex',
    address: '456 Sports Ave, Quezon City',
    region: 'NCR',
    latitude: 14.6760,
    longitude: 121.0437,
    max_capacity: 500,
    current_occupancy: 380,
    coordinator_phone: '+639181234567',
    status: 'YELLOW',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Elementary School Gymnasium',
    address: '789 School Rd, Pasig',
    region: 'NCR',
    latitude: 14.5764,
    longitude: 121.0851,
    max_capacity: 300,
    current_occupancy: 275,
    coordinator_phone: '+639191234567',
    status: 'RED',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Community Center Makati',
    address: '321 Ayala Ave, Makati',
    region: 'NCR',
    latitude: 14.5547,
    longitude: 121.0244,
    max_capacity: 150,
    current_occupancy: 45,
    coordinator_phone: '+639201234567',
    status: 'GREEN',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Taguig Convention Center',
    address: '555 BGC, Taguig',
    region: 'NCR',
    latitude: 14.5176,
    longitude: 121.0509,
    max_capacity: 800,
    current_occupancy: 620,
    coordinator_phone: '+639211234567',
    status: 'YELLOW',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Marikina Sports Center',
    address: '888 Shoe Ave, Marikina',
    region: 'NCR',
    latitude: 14.6507,
    longitude: 121.1029,
    max_capacity: 400,
    current_occupancy: 95,
    coordinator_phone: '+639221234567',
    status: 'GREEN',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  
  // Cebu City Shelters (20)
  {
    id: 'cebu-1',
    name: 'Cebu City Sports Center',
    address: 'Sudlon, Lahug, Cebu City',
    region: 'Region VII',
    latitude: 10.3157,
    longitude: 123.8854,
    max_capacity: 1000,
    current_occupancy: 250,
    coordinator_phone: '+639321234567',
    status: 'GREEN',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cebu-2',
    name: 'Abellana National School Gymnasium',
    address: 'N. Escario St, Cebu City',
    region: 'Region VII',
    latitude: 10.3181,
    longitude: 123.8947,
    max_capacity: 600,
    current_occupancy: 480,
    coordinator_phone: '+639331234567',
    status: 'YELLOW',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cebu-3',
    name: 'Cebu City Central School',
    address: 'Osmeña Blvd, Cebu City',
    region: 'Region VII',
    latitude: 10.2935,
    longitude: 123.9015,
    max_capacity: 400,
    current_occupancy: 370,
    coordinator_phone: '+639341234567',
    status: 'RED',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cebu-4',
    name: 'Barangay Guadalupe Covered Court',
    address: 'Guadalupe, Cebu City',
    region: 'Region VII',
    latitude: 10.2945,
    longitude: 123.9125,
    max_capacity: 300,
    current_occupancy: 85,
    coordinator_phone: '+639351234567',
    status: 'GREEN',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cebu-5',
    name: 'Barangay Lahug Multi-Purpose Hall',
    address: 'Gorordo Ave, Lahug, Cebu City',
    region: 'Region VII',
    latitude: 10.3265,
    longitude: 123.8965,
    max_capacity: 250,
    current_occupancy: 190,
    coordinator_phone: '+639361234567',
    status: 'YELLOW',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cebu-6',
    name: 'University of Cebu Main Campus Gym',
    address: 'Sanciangko St, Cebu City',
    region: 'Region VII',
    latitude: 10.2965,
    longitude: 123.9025,
    max_capacity: 800,
    current_occupancy: 200,
    coordinator_phone: '+639371234567',
    status: 'GREEN',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cebu-7',
    name: 'Barangay Mabolo Sports Complex',
    address: 'Mabolo, Cebu City',
    region: 'Region VII',
    latitude: 10.3285,
    longitude: 123.9085,
    max_capacity: 500,
    current_occupancy: 455,
    coordinator_phone: '+639381234567',
    status: 'RED',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cebu-8',
    name: 'Barangay Kamputhaw Covered Court',
    address: 'Kamputhaw, Cebu City',
    region: 'Region VII',
    latitude: 10.3125,
    longitude: 123.8985,
    max_capacity: 200,
    current_occupancy: 45,
    coordinator_phone: '+639391234567',
    status: 'GREEN',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cebu-9',
    name: 'Cebu City Medical Center Annex',
    address: 'Natalio Bacalso Ave, Cebu City',
    region: 'Region VII',
    latitude: 10.2825,
    longitude: 123.8945,
    max_capacity: 350,
    current_occupancy: 280,
    coordinator_phone: '+639401234567',
    status: 'YELLOW',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cebu-10',
    name: 'Barangay Apas Community Center',
    address: 'Apas, Cebu City',
    region: 'Region VII',
    latitude: 10.3345,
    longitude: 123.9105,
    max_capacity: 180,
    current_occupancy: 50,
    coordinator_phone: '+639411234567',
    status: 'GREEN',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cebu-11',
    name: 'Barangay Talamban Sports Complex',
    address: 'Talamban, Cebu City',
    region: 'Region VII',
    latitude: 10.3565,
    longitude: 123.9185,
    max_capacity: 450,
    current_occupancy: 120,
    coordinator_phone: '+639421234567',
    status: 'GREEN',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cebu-12',
    name: 'Barangay Pardo Gymnasium',
    address: 'Pardo, Cebu City',
    region: 'Region VII',
    latitude: 10.2685,
    longitude: 123.8825,
    max_capacity: 320,
    current_occupancy: 245,
    coordinator_phone: '+639431234567',
    status: 'YELLOW',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cebu-13',
    name: 'Barangay Tisa Multi-Purpose Hall',
    address: 'Tisa, Cebu City',
    region: 'Region VII',
    latitude: 10.2865,
    longitude: 123.8765,
    max_capacity: 280,
    current_occupancy: 260,
    coordinator_phone: '+639441234567',
    status: 'RED',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cebu-14',
    name: 'Barangay Busay Community Hall',
    address: 'Busay, Cebu City',
    region: 'Region VII',
    latitude: 10.3485,
    longitude: 123.8685,
    max_capacity: 220,
    current_occupancy: 65,
    coordinator_phone: '+639451234567',
    status: 'GREEN',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cebu-15',
    name: 'Barangay Banilad Sports Center',
    address: 'Banilad, Cebu City',
    region: 'Region VII',
    latitude: 10.3425,
    longitude: 123.9145,
    max_capacity: 550,
    current_occupancy: 420,
    coordinator_phone: '+639461234567',
    status: 'YELLOW',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cebu-16',
    name: 'Barangay Kasambagan Covered Court',
    address: 'Kasambagan, Cebu City',
    region: 'Region VII',
    latitude: 10.3205,
    longitude: 123.9065,
    max_capacity: 300,
    current_occupancy: 90,
    coordinator_phone: '+639471234567',
    status: 'GREEN',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cebu-17',
    name: 'Barangay Sambag I Community Center',
    address: 'Sambag I, Cebu City',
    region: 'Region VII',
    latitude: 10.3065,
    longitude: 123.9005,
    max_capacity: 260,
    current_occupancy: 235,
    coordinator_phone: '+639481234567',
    status: 'RED',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cebu-18',
    name: 'Barangay Capitol Site Gymnasium',
    address: 'Capitol Site, Cebu City',
    region: 'Region VII',
    latitude: 10.3105,
    longitude: 123.8925,
    max_capacity: 400,
    current_occupancy: 110,
    coordinator_phone: '+639491234567',
    status: 'GREEN',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cebu-19',
    name: 'Barangay Labangon Sports Complex',
    address: 'Labangon, Cebu City',
    region: 'Region VII',
    latitude: 10.2785,
    longitude: 123.8885,
    max_capacity: 380,
    current_occupancy: 295,
    coordinator_phone: '+639501234567',
    status: 'YELLOW',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cebu-20',
    name: 'Barangay Basak San Nicolas Covered Court',
    address: 'Basak San Nicolas, Cebu City',
    region: 'Region VII',
    latitude: 10.2905,
    longitude: 123.8805,
    max_capacity: 290,
    current_occupancy: 75,
    coordinator_phone: '+639511234567',
    status: 'GREEN',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export async function initializeMap(containerId: string, supabase: SupabaseClient) {
  // Initialize map centered on Philippines to show both Manila and Cebu
  map = L.map(containerId).setView([12.0, 122.5], 6)

  // Add OpenStreetMap tiles
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  // Try to fetch from Supabase first
  const { data: shelters, error } = await supabase
    .from('public_shelters')
    .select('*')
    .eq('is_active', true)

  let shelterData: Shelter[] = []

  if (error) {
    console.warn('Supabase not available, using mock data:', error.message)
    shelterData = mockShelters
    
    // Show info message on map
    const infoDiv = document.createElement('div')
    infoDiv.style.cssText = `
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: #3b82f6;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 1000;
      font-size: 0.875rem;
      font-weight: 500;
    `
    infoDiv.textContent = '📍 Showing 26 demo evacuation centers (6 in Metro Manila, 20 in Cebu City)'
    document.getElementById(containerId)?.parentElement?.appendChild(infoDiv)
  } else if (shelters && shelters.length > 0) {
    shelterData = shelters
    console.log('Loaded shelters from Supabase')
  } else {
    // No data from Supabase, use mock data
    console.log('No shelters in database, using mock data')
    shelterData = mockShelters
  }

  // Render markers
  shelterData.forEach((shelter: Shelter) => {
    addOrUpdateMarker(shelter)
  })

  // Subscribe to real-time updates (only if Supabase is available)
  if (!error) {
    supabase
      .channel('shelters-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shelters'
        },
        (payload) => {
          console.log('Realtime update:', payload)
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            addOrUpdateMarker(payload.new as Shelter)
          } else if (payload.eventType === 'DELETE') {
            removeMarker(payload.old.id)
          }
        }
      )
      .subscribe()
  }

  console.log(`Map initialized with ${shelterData.length} evacuation centers`)
}

function addOrUpdateMarker(shelter: Shelter) {
  if (!map) return

  const { id, name, address, latitude, longitude, current_occupancy, max_capacity, status } = shelter

  // Get or create marker
  let marker = markers.get(id)
  
  if (!marker) {
    marker = L.marker([latitude, longitude])
    marker.addTo(map)
    markers.set(id, marker)
  } else {
    marker.setLatLng([latitude, longitude])
  }

  // Set marker icon color based on status
  const iconColor = getMarkerColor(status)
  const icon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${iconColor}; width: 25px; height: 25px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12]
  })
  marker.setIcon(icon)

  // Set popup content
  const popupContent = `
    <div style="min-width: 200px;">
      <h3 style="margin: 0 0 0.5rem 0; font-size: 1rem;">${name}</h3>
      <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: #666;">${address}</p>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 600;">Occupancy:</span>
        <span style="font-weight: 600; color: ${iconColor};">${current_occupancy} / ${max_capacity}</span>
      </div>
      <div style="margin-top: 0.5rem; padding: 0.25rem 0.5rem; background-color: ${iconColor}; color: white; text-align: center; border-radius: 4px; font-weight: 600;">
        ${status}
      </div>
    </div>
  `
  marker.bindPopup(popupContent)
}

function removeMarker(shelterId: string) {
  const marker = markers.get(shelterId)
  if (marker && map) {
    map.removeLayer(marker)
    markers.delete(shelterId)
  }
}

function getMarkerColor(status: string): string {
  switch (status) {
    case 'GREEN':
      return '#10b981'
    case 'YELLOW':
      return '#f59e0b'
    case 'RED':
      return '#ef4444'
    default:
      return '#6b7280'
  }
}

export function destroyMap() {
  if (map) {
    map.remove()
    map = null
    markers.clear()
  }
}
