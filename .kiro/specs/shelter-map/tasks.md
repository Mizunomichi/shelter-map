# Implementation Plan: ShelterMap

## Overview

This plan implements a mobile-first Progressive Web App (PWA) for real-time evacuation center capacity monitoring. The system uses Python for backend Edge Functions (Supabase/Deno will run Python via subprocess or we'll use Python-based serverless), TypeScript/JavaScript for the PWA frontend, and integrates Supabase (PostgreSQL, Realtime, Auth) with Semaphore PH SMS alerts. The implementation follows a layered approach: database schema and backend logic first, then frontend components, offline support, and finally integration.

## Tasks

- [x] 1. Set up project structure and database schema
  - Create directory structure for frontend (PWA) and backend (Edge Functions)
  - Define Supabase PostgreSQL schema with `shelters` and `sms_logs` tables
  - Set up database migrations with proper constraints and indexes
  - Configure Supabase Row Level Security (RLS) policies for public and admin roles
  - Initialize Python virtual environment and install dependencies (bcrypt, supabase-py)
  - Initialize frontend with Vite + PWA plugin, install Leaflet, Chart.js, Workbox
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2_

- [ ] 2. Implement core capacity status computation
  - [x] 2.1 Create Python utility module for capacity status calculation
    - Implement `compute_capacity_status(current_occupancy: int, max_capacity: int) -> str` function
    - Handle edge case where max_capacity is 0
    - Return 'GREEN', 'YELLOW', or 'RED' based on percentage thresholds
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ]* 2.2 Write property test for capacity status computation
    - **Property 1: Status is always one of GREEN, YELLOW, RED**
    - **Validates: Requirements 2.5**
    - Use Hypothesis to generate random occupancy/capacity pairs
    - Verify output is always a valid CapacityStatus enum value
  
  - [ ]* 2.3 Write unit tests for capacity status edge cases
    - Test zero capacity returns GREEN
    - Test boundary conditions (69%, 70%, 89%, 90%)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 3. Implement PIN verification and shelter update Edge Function
  - [ ] 3.1 Create update-shelter Edge Function handler
    - Implement request body validation (shelter_id, pin, current_occupancy)
    - Query shelter record from PostgreSQL by shelter_id
    - Verify PIN using bcrypt.verify() against stored pin_hash
    - Validate occupancy constraints (non-negative, not exceeding max_capacity)
    - Update shelter record with new current_occupancy and updated_at timestamp
    - Return appropriate HTTP status codes (200, 400, 401, 404)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_
  
  - [ ]* 3.2 Write property test for PIN verification
    - **Property 2: Valid PIN always verifies successfully**
    - **Validates: Requirements 3.2, 3.3**
    - Generate random PINs, hash them, verify round-trip always succeeds
  
  - [ ]* 3.3 Write unit tests for update-shelter validation
    - Test invalid UUID returns 400
    - Test negative occupancy returns 400
    - Test occupancy exceeding capacity returns 400
    - Test non-existent shelter_id returns 404
    - Test invalid PIN returns 401 with no DB write
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.6_

- [ ] 4. Implement SMS alert functionality
  - [ ] 4.1 Create send-sms-alert Edge Function
    - Implement Semaphore PH API client with POST to /messages endpoint
    - Read API key from Supabase Edge Function environment secret
    - Compose alert message with shelter name and occupancy percentage
    - Log SMS delivery status to sms_logs table (sent/failed)
    - Handle API failures gracefully without rolling back shelter update
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ] 4.2 Integrate SMS alert trigger into update-shelter function
    - Calculate occupancy percentage after successful update
    - Invoke send-sms-alert when percentage >= 90%
    - Ensure SMS failure does not affect shelter update commit
    - _Requirements: 4.1, 4.4_
  
  - [ ]* 4.3 Write integration test for SMS alert trigger
    - Mock Semaphore PH API
    - Submit update that crosses 90% threshold
    - Verify SMS function is called exactly once
    - _Requirements: 4.1, 4.2_

- [ ] 5. Checkpoint - Ensure backend tests pass
  - Run all backend unit and integration tests
  - Verify Edge Functions deploy successfully to Supabase
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement frontend MapView component
  - [ ] 6.1 Create Leaflet map component with marker rendering
    - Initialize Leaflet map centered on disaster area coordinates
    - Fetch initial shelter data from Supabase REST API
    - Render markers for each shelter with color based on capacity status
    - Implement marker click handler to display popup with shelter details
    - Cache last-known marker state in localStorage for offline display
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.7_
  
  - [ ] 6.2 Integrate Supabase Realtime subscription for live updates
    - Subscribe to Supabase Realtime channel for shelters table
    - Implement onUpdate callback to refresh marker color on change events
    - Handle WebSocket reconnection with exponential backoff
    - Reconcile missed updates by fetching latest state on reconnect
    - _Requirements: 1.6, 11.1, 11.2, 11.3, 11.4_
  
  - [ ]* 6.3 Write unit tests for MapView marker updates
    - Test marker color changes based on capacity status
    - Test popup displays correct shelter information
    - _Requirements: 1.2, 1.3, 1.4, 1.5_

- [ ] 7. Implement CoordinatorUpdateForm component
  - [ ] 7.1 Create PIN-authenticated update form UI
    - Build form with shelter_id selector, PIN input, and occupancy input
    - Implement client-side validation (non-negative occupancy)
    - Detect online/offline state using navigator.onLine
    - POST to /update-shelter Edge Function when online
    - Display success/error messages based on response
    - _Requirements: 3.1, 3.4, 3.7, 3.8_
  
  - [ ] 7.2 Implement offline queue display
    - Query IndexedDB for unsynced queue items
    - Display count of pending submissions to coordinator
    - _Requirements: 5.7_
  
  - [ ]* 7.3 Write integration test for form submission
    - Test successful submission with valid PIN
    - Test error handling for invalid PIN (401)
    - Test validation errors (400)
    - _Requirements: 3.3, 3.4, 3.5, 3.8_

- [ ] 8. Implement Service Worker and offline queue
  - [ ] 8.1 Create Service Worker with caching strategies
    - Implement install event to cache static PWA assets and map tiles
    - Implement activate event to clean up old caches
    - Implement fetch event with Cache-First strategy for assets
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ] 8.2 Implement offline submission queue with IndexedDB
    - Create IndexedDB schema for offline_queue store
    - Intercept POST /update-shelter requests when offline
    - Write submission to IndexedDB with synced: false
    - Return synthetic {queued: true} response to form
    - _Requirements: 5.1, 5.2_
  
  - [ ] 8.3 Implement Background Sync for queue replay
    - Register Background Sync event on network restoration
    - Fetch all unsynced items from IndexedDB
    - Replay each item by POSTing to /update-shelter
    - Mark items as synced: true on success
    - Mark items as synced: true, failed: true on 401/404
    - Leave items unsynced on network errors for retry
    - _Requirements: 5.3, 5.4, 5.5, 5.6_
  
  - [ ]* 8.4 Write property test for offline queue replay
    - **Property 3: Synced items are never re-submitted**
    - **Validates: Requirements 5.4, 5.5**
    - Generate random queue states, verify synced items remain untouched
  
  - [ ]* 8.5 Write integration test for offline queue flow
    - Simulate offline state, submit update, verify IndexedDB write
    - Simulate network restoration, verify Background Sync replays queue
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 9. Checkpoint - Ensure frontend core functionality works
  - Test map displays and updates in real-time
  - Test coordinator form submits successfully online
  - Test offline queue captures and replays submissions
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement LGU Admin Dashboard
  - [ ] 10.1 Create admin authentication and route guard
    - Implement Supabase Auth login page at /admin/login
    - Create route guard to redirect unauthenticated users
    - Verify JWT role is 'lgu_admin' before rendering dashboard
    - _Requirements: 6.1, 10.3_
  
  - [ ] 10.2 Create shelter data table with filtering
    - Fetch shelters from Supabase REST API with pagination (50 rows/page)
    - Implement region filter dropdown
    - Implement capacity status filter (GREEN/YELLOW/RED)
    - Implement date range filter on updated_at
    - Implement text search on name and address fields
    - Render sortable data table with all shelter columns
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.6, 6.9_
  
  - [ ] 10.3 Implement occupancy distribution chart
    - Use Chart.js to render bar/pie chart of shelter counts by CapacityStatus
    - Update chart when filters are applied
    - _Requirements: 6.8_
  
  - [ ]* 10.4 Write unit tests for dashboard filters
    - Test region filter returns only matching shelters
    - Test status filter returns only matching shelters
    - Test date range filter returns only shelters in range
    - _Requirements: 6.3, 6.4, 6.5_

- [ ] 11. Implement CSV export functionality
  - [ ] 11.1 Create CSV export function
    - Implement CSV serialization with RFC 4180 escaping for commas/quotes
    - Include columns: ID, Name, Address, Region, Max Capacity, Current Occupancy, Status, Last Updated
    - Generate CSV client-side from filtered shelter data
    - Trigger browser download with filename format: shelters_YYYY-MM-DD.csv
    - Handle empty result set (header-only CSV)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ]* 11.2 Write property test for CSV round-trip
    - **Property 4: CSV row count equals shelter array length**
    - **Validates: Requirements 7.1, 7.3**
    - Generate random shelter arrays, verify CSV has correct row count
  
  - [ ]* 11.3 Write unit tests for CSV escaping
    - Test shelter names with commas are properly escaped
    - Test shelter addresses with quotes are properly escaped
    - Test empty shelter list produces header-only CSV
    - _Requirements: 7.2, 7.3_

- [ ] 12. Implement data validation and security
  - [ ] 12.1 Add database constraints and triggers
    - Create CHECK constraints for occupancy, latitude, longitude ranges
    - Create CHECK constraint for coordinator_phone E.164 format
    - Create CHECK constraint for pin_hash length (60 chars)
    - Create trigger to compute capacity status on INSERT/UPDATE
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ] 12.2 Configure Supabase RLS policies
    - Create public SELECT policy excluding pin_hash column
    - Create lgu_admin SELECT policy with full access
    - Create lgu_admin UPDATE/DELETE policies
    - Verify Edge Functions bypass RLS with service role key
    - _Requirements: 10.2, 10.3_
  
  - [ ] 12.3 Implement HTTPS enforcement and secret management
    - Configure Supabase project to enforce HTTPS
    - Store Semaphore PH API key as Edge Function environment secret
    - Clear PIN from IndexedDB after successful sync
    - _Requirements: 10.4, 10.5, 4.5_
  
  - [ ]* 12.4 Write property test for data integrity
    - **Property 5: Occupancy always within valid range**
    - **Validates: Requirements 9.1**
    - Generate random shelter updates, verify constraints are enforced

- [ ] 13. Implement PWA manifest and installation
  - [ ] 13.1 Create PWA manifest and icons
    - Generate manifest.json with app name, icons, theme colors
    - Create app icons in multiple sizes (192x192, 512x512)
    - Configure Vite PWA plugin to generate service worker
    - Test installation on mobile device home screen
    - _Requirements: 8.4_

- [ ] 14. Integration and end-to-end wiring
  - [ ] 14.1 Wire all components together
    - Connect MapView to Realtime subscription
    - Connect CoordinatorUpdateForm to Edge Function and Service Worker
    - Connect AdminDashboard to Supabase Auth and REST API
    - Connect Service Worker to Background Sync and IndexedDB
    - Verify SMS alerts trigger correctly at 90% threshold
    - _Requirements: 1.6, 3.7, 4.1, 5.3, 6.2, 11.3_
  
  - [ ]* 14.2 Write end-to-end integration tests
    - Test full coordinator update flow (online and offline)
    - Test real-time map update propagation
    - Test admin dashboard filter and export flow
    - _Requirements: 1.6, 5.1, 5.3, 6.2, 7.5_

- [ ] 15. Final checkpoint - Ensure all tests pass and system is functional
  - Run full test suite (unit, property, integration)
  - Test PWA installation on mobile device
  - Verify offline functionality works as expected
  - Verify SMS alerts are sent at 90% threshold
  - Test admin dashboard with real data
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Backend Edge Functions use Python for business logic
- Frontend PWA uses TypeScript/JavaScript with Vite build tooling
- Property tests use Hypothesis (Python) and fast-check (JavaScript)
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at major milestones
- Service Worker and offline support are critical for disaster resilience
