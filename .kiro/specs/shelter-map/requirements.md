# Requirements Document

## Introduction

ShelterMap is a mobile-first Progressive Web App (PWA) that provides real-time visibility into evacuation center capacity during disaster events. The system serves three user roles: the general public (read-only map view), shelter coordinators (PIN-authenticated capacity updates), and LGU administrators (full dashboard with filtering, CSV export, and occupancy charts). It is backed by Supabase (PostgreSQL, Realtime, Auth, Edge Functions) with Semaphore PH SMS alerts when centers reach 90% capacity. Offline support via a service worker queues coordinator submissions and replays them when connectivity is restored.

## Glossary

- **MapView**: The Leaflet-based map component visible to all users showing color-coded shelter markers.
- **CoordinatorUpdateForm**: The PIN-authenticated form used by shelter coordinators to submit occupancy updates.
- **AdminDashboard**: The LGU administrator interface with filtering, charts, and CSV export.
- **ServiceWorker**: The PWA service worker that caches assets and manages the offline submission queue.
- **EdgeFunction**: A Supabase Edge Function (Deno runtime) running server-side logic.
- **UpdateShelterFunction**: The Edge Function that validates coordinator PINs and updates shelter occupancy.
- **SendSmsAlertFunction**: The Edge Function that sends SMS alerts via Semaphore PH.
- **RealtimeEngine**: The Supabase Realtime WebSocket service that broadcasts database change events.
- **OfflineQueue**: The IndexedDB-backed queue that stores coordinator submissions made while offline.
- **CapacityStatus**: An enum value of GREEN, YELLOW, or RED representing a shelter's occupancy level.
- **Shelter**: A PostgreSQL row representing an evacuation center with occupancy and location data.
- **SmsLog**: A PostgreSQL row recording the outcome of an SMS alert dispatch.
- **LGU_Admin**: A user with the `lgu_admin` role authenticated via Supabase Auth.
- **Coordinator**: A shelter coordinator who authenticates using a PIN to submit occupancy updates.
- **Semaphore_PH**: The external SMS gateway used to send capacity alert messages.
- **System**: The ShelterMap PWA and its backend services collectively.

---

## Requirements

### Requirement 1: Real-Time Map Display

**User Story:** As a member of the general public, I want to view a live map of evacuation centers with color-coded capacity indicators, so that I can quickly identify which shelters have available space.

#### Acceptance Criteria

1. THE MapView SHALL render a Leaflet map centered on the active disaster area and display all active shelters as markers.
2. WHEN a shelter's `current_occupancy` is less than 70% of `max_capacity`, THE MapView SHALL display that shelter's marker in green.
3. WHEN a shelter's `current_occupancy` is greater than or equal to 70% and less than 90% of `max_capacity`, THE MapView SHALL display that shelter's marker in yellow.
4. WHEN a shelter's `current_occupancy` is greater than or equal to 90% of `max_capacity`, THE MapView SHALL display that shelter's marker in red.
5. WHEN a user clicks a shelter marker, THE MapView SHALL display a popup containing the shelter name, address, current occupancy, and maximum capacity.
6. WHEN THE RealtimeEngine broadcasts a shelter update, THE MapView SHALL update the affected marker's color within the Supabase Realtime SLA.
7. WHILE the device is offline, THE MapView SHALL display the last-known marker state from the localStorage cache.

---

### Requirement 2: Capacity Status Computation

**User Story:** As a system operator, I want capacity status to be computed consistently from occupancy data, so that all components display the same color-coded status.

#### Acceptance Criteria

1. WHEN `max_capacity` is 0, THE System SHALL return GREEN as the capacity status.
2. WHEN `current_occupancy` divided by `max_capacity` multiplied by 100 is less than 70, THE System SHALL return GREEN as the capacity status.
3. WHEN `current_occupancy` divided by `max_capacity` multiplied by 100 is greater than or equal to 70 and less than 90, THE System SHALL return YELLOW as the capacity status.
4. WHEN `current_occupancy` divided by `max_capacity` multiplied by 100 is greater than or equal to 90, THE System SHALL return RED as the capacity status.
5. THE System SHALL never return a null or undefined capacity status for any valid occupancy and capacity pair.

---

### Requirement 3: Coordinator PIN Authentication and Occupancy Update

**User Story:** As a shelter coordinator, I want to submit occupancy updates using my PIN, so that I can keep the map current without needing a full login account.

#### Acceptance Criteria

1. WHEN a coordinator submits a shelter update, THE UpdateShelterFunction SHALL validate that `shelter_id` is a valid UUID before processing.
2. WHEN a coordinator submits a shelter update, THE UpdateShelterFunction SHALL verify the submitted PIN against the stored bcrypt hash for that shelter.
3. IF the submitted PIN does not match the stored bcrypt hash, THEN THE UpdateShelterFunction SHALL return HTTP 401 with `{success: false, error: "Invalid PIN"}` and SHALL NOT write to the database.
4. IF `current_occupancy` is negative, THEN THE UpdateShelterFunction SHALL return HTTP 400 with `{success: false, error: "Occupancy cannot be negative"}`.
5. IF `current_occupancy` exceeds `max_capacity`, THEN THE UpdateShelterFunction SHALL return HTTP 400 with `{success: false, error: "Occupancy exceeds max capacity"}`.
6. IF the `shelter_id` does not match any record, THEN THE UpdateShelterFunction SHALL return HTTP 404 with `{success: false, error: "Shelter not found"}`.
7. WHEN PIN verification succeeds and occupancy is valid, THE UpdateShelterFunction SHALL update `current_occupancy` and `updated_at` for the shelter record in PostgreSQL.
8. WHEN the shelter update is committed, THE UpdateShelterFunction SHALL return HTTP 200 with `{success: true}`.

---

### Requirement 4: SMS Alert at 90% Capacity

**User Story:** As an LGU administrator, I want to receive an SMS alert when a shelter reaches 90% capacity, so that I can coordinate relief operations proactively.

#### Acceptance Criteria

1. WHEN a shelter update results in `current_occupancy` being greater than or equal to 90% of `max_capacity`, THE UpdateShelterFunction SHALL invoke THE SendSmsAlertFunction for that shelter.
2. WHEN THE SendSmsAlertFunction is invoked, THE SendSmsAlertFunction SHALL POST an alert message containing the shelter name and occupancy percentage to the Semaphore_PH `/messages` endpoint.
3. WHEN Semaphore_PH returns a 2xx response, THE SendSmsAlertFunction SHALL record a `SmsLog` entry with `status: 'sent'`.
4. IF Semaphore_PH returns a non-2xx response or times out, THEN THE SendSmsAlertFunction SHALL record a `SmsLog` entry with `status: 'failed'` and SHALL NOT roll back the shelter occupancy update.
5. THE SendSmsAlertFunction SHALL read the Semaphore_PH API key exclusively from a Supabase Edge Function environment secret and SHALL NOT expose it to the client.

---

### Requirement 5: Offline Submission Queue

**User Story:** As a shelter coordinator, I want my occupancy updates to be saved when I am offline, so that no data is lost during connectivity gaps.

#### Acceptance Criteria

1. WHEN a coordinator submits an update and the device is offline, THE ServiceWorker SHALL intercept the POST to `/update-shelter` and write the submission to the OfflineQueue in IndexedDB with `synced: false`.
2. WHEN a submission is written to the OfflineQueue, THE ServiceWorker SHALL return a synthetic response `{queued: true}` to the CoordinatorUpdateForm.
3. WHEN network connectivity is restored, THE ServiceWorker SHALL register a Background Sync event and replay all OfflineQueue items where `synced` is false.
4. WHEN replaying a queued item and THE UpdateShelterFunction returns a success response, THE ServiceWorker SHALL mark that item as `synced: true` in IndexedDB.
5. WHEN replaying a queued item and THE UpdateShelterFunction returns HTTP 401 or HTTP 404, THE ServiceWorker SHALL mark that item as `synced: true` and `failed: true` in IndexedDB and SHALL NOT retry it.
6. WHEN replaying a queued item and a network error occurs, THE ServiceWorker SHALL leave that item with `synced: false` so it is retried on the next Background Sync event.
7. THE CoordinatorUpdateForm SHALL display the count of pending (unsynced) OfflineQueue items to the coordinator.

---

### Requirement 6: LGU Admin Dashboard

**User Story:** As an LGU administrator, I want a dashboard where I can view, filter, and analyze shelter occupancy data, so that I can make informed decisions during disaster response.

#### Acceptance Criteria

1. WHEN a user navigates to `/admin` without a valid Supabase Auth session, THE AdminDashboard SHALL redirect the user to `/admin/login`.
2. WHEN an authenticated LGU_Admin loads the dashboard, THE AdminDashboard SHALL fetch and display all active shelters in a sortable, filterable data table.
3. WHEN an LGU_Admin applies a region filter, THE AdminDashboard SHALL display only shelters matching the selected region.
4. WHEN an LGU_Admin applies a capacity status filter, THE AdminDashboard SHALL display only shelters matching the selected CapacityStatus.
5. WHEN an LGU_Admin applies a date range filter, THE AdminDashboard SHALL display only shelters whose `updated_at` falls within the specified range.
6. WHEN an LGU_Admin enters a search term, THE AdminDashboard SHALL display only shelters whose name or address contains the search term.
7. WHEN an LGU_Admin clicks the Export CSV button, THE AdminDashboard SHALL generate and download a CSV file of the currently filtered shelter data.
8. THE AdminDashboard SHALL render an occupancy distribution chart using Chart.js showing the breakdown of shelters by CapacityStatus.
9. THE AdminDashboard SHALL paginate shelter table results at 50 rows per page.

---

### Requirement 7: CSV Export

**User Story:** As an LGU administrator, I want to export shelter data as a CSV file, so that I can share and analyze it in external tools.

#### Acceptance Criteria

1. WHEN THE AdminDashboard exports a CSV, THE System SHALL include the columns: ID, Name, Address, Region, Max Capacity, Current Occupancy, Status, and Last Updated.
2. WHEN a shelter name or address contains commas or double-quote characters, THE System SHALL escape those fields according to RFC 4180 CSV formatting rules.
3. WHEN the filtered shelter list is empty, THE System SHALL produce a CSV file containing only the header row.
4. THE System SHALL name the downloaded file `shelters_` followed by the current date in ISO 8601 format with a `.csv` extension.
5. THE System SHALL generate the CSV client-side from the already-fetched filtered data without an additional server request.

---

### Requirement 8: Service Worker and PWA Offline Support

**User Story:** As a user in a low-connectivity environment, I want the app to remain functional when offline, so that I can still access shelter information during a disaster.

#### Acceptance Criteria

1. WHEN the ServiceWorker installs, THE ServiceWorker SHALL cache all static PWA assets and map tiles using a Cache-First strategy.
2. WHEN a cached asset is requested and the device is offline, THE ServiceWorker SHALL serve the cached version.
3. WHEN the ServiceWorker activates, THE ServiceWorker SHALL remove outdated caches from previous versions.
4. THE System SHALL provide a PWA manifest enabling installation on mobile home screens.

---

### Requirement 9: Data Integrity and Validation

**User Story:** As a system operator, I want all shelter data to satisfy defined constraints, so that the system remains consistent and reliable.

#### Acceptance Criteria

1. THE System SHALL enforce that `current_occupancy` is greater than or equal to 0 and less than or equal to `max_capacity` for every Shelter record.
2. THE System SHALL enforce that `latitude` is in the range [-90, 90] and `longitude` is in the range [-180, 180] for every Shelter record.
3. THE System SHALL enforce that `coordinator_phone` matches the E.164 pattern `^\+63\d{10}$` for every Shelter record.
4. THE System SHALL enforce that `pin_hash` is a valid bcrypt hash of exactly 60 characters for every Shelter record.
5. THE System SHALL enforce that `max_capacity` is greater than or equal to 0 for every Shelter record.

---

### Requirement 10: Security

**User Story:** As a system operator, I want the system to protect sensitive data and enforce access controls, so that coordinator PINs and admin data are not exposed.

#### Acceptance Criteria

1. THE System SHALL store coordinator PINs exclusively as bcrypt hashes and SHALL NOT store plaintext PINs in PostgreSQL.
2. THE System SHALL exclude the `pin_hash` column from all Supabase Row Level Security SELECT policies accessible to the public role.
3. WHEN a user accesses the AdminDashboard, THE System SHALL verify a valid Supabase Auth JWT with `role = 'lgu_admin'` before returning any admin data.
4. THE System SHALL enforce HTTPS for all PWA assets and API calls.
5. WHEN a synced OfflineQueue item is marked `synced: true`, THE ServiceWorker SHALL clear the PIN from that IndexedDB record.

---

### Requirement 11: Realtime Subscription and Reconnection

**User Story:** As a map viewer, I want the map to automatically recover from connection drops, so that I always see up-to-date shelter information.

#### Acceptance Criteria

1. WHEN THE RealtimeEngine broadcasts an INSERT or UPDATE on the `shelters` table, THE MapView SHALL invoke the registered `onUpdate` callback with the updated shelter payload.
2. WHEN the WebSocket connection to THE RealtimeEngine drops, THE System SHALL attempt reconnection using exponential backoff via the Supabase JS client SDK.
3. WHEN the WebSocket connection is restored, THE MapView SHALL re-subscribe to the shelters channel and fetch the latest shelter state via REST to reconcile any missed updates.
4. THE System SHALL use a single shared Realtime channel for all shelter updates rather than per-shelter channels.

---

### Requirement 12: Parser and Serializer — Shelter Data Round-Trip

**User Story:** As a developer, I want shelter data to serialize and deserialize correctly, so that data integrity is preserved across storage and transport boundaries.

#### Acceptance Criteria

1. WHEN a Shelter object is serialized to JSON for transport or storage, THE System SHALL produce a valid JSON representation containing all required fields.
2. WHEN a JSON representation of a Shelter is deserialized, THE System SHALL produce a Shelter object equivalent to the original.
3. FOR ALL valid Shelter objects, serializing then deserializing SHALL produce an object equivalent to the original (round-trip property).
4. WHEN a JSON payload is missing required fields, THE System SHALL return a descriptive validation error rather than a partial object.
