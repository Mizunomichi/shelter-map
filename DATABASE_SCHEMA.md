# ShelterMap Database Schema

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         SHELTERS                             │
├─────────────────────────────────────────────────────────────┤
│ id                    UUID          PRIMARY KEY              │
│ name                  TEXT          NOT NULL                 │
│ address               TEXT          NOT NULL                 │
│ region                TEXT          NOT NULL                 │
│ latitude              DECIMAL(10,8) CHECK (-90 to 90)        │
│ longitude             DECIMAL(11,8) CHECK (-180 to 180)      │
│ max_capacity          INTEGER       CHECK (>= 0)             │
│ current_occupancy     INTEGER       CHECK (0 to max_cap)     │
│ pin_hash              TEXT(60)      NOT NULL (bcrypt)        │
│ coordinator_phone     TEXT          CHECK (E.164 format)     │
│ status                ENUM          (GREEN/YELLOW/RED)       │
│ is_active             BOOLEAN       DEFAULT true             │
│ created_at            TIMESTAMPTZ   DEFAULT NOW()            │
│ updated_at            TIMESTAMPTZ   DEFAULT NOW()            │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         SMS_LOGS                             │
├─────────────────────────────────────────────────────────────┤
│ id                    UUID          PRIMARY KEY              │
│ shelter_id            UUID          FOREIGN KEY → shelters   │
│ message               TEXT          NOT NULL                 │
│ recipient             TEXT          CHECK (E.164 format)     │
│ status                TEXT          CHECK ('sent'|'failed')  │
│ sent_at               TIMESTAMPTZ   DEFAULT NOW()            │
└─────────────────────────────────────────────────────────────┘
```

## Table Details

### Shelters Table

**Purpose**: Stores evacuation center information with real-time capacity tracking.

**Columns**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique shelter identifier |
| `name` | TEXT | NOT NULL | Shelter display name |
| `address` | TEXT | NOT NULL | Full street address |
| `region` | TEXT | NOT NULL | LGU region code (e.g., "NCR") |
| `latitude` | DECIMAL(10,8) | CHECK (-90 ≤ lat ≤ 90) | WGS84 latitude |
| `longitude` | DECIMAL(11,8) | CHECK (-180 ≤ lng ≤ 180) | WGS84 longitude |
| `max_capacity` | INTEGER | CHECK (≥ 0) | Maximum shelter capacity |
| `current_occupancy` | INTEGER | CHECK (0 ≤ occ ≤ max_cap) | Current headcount |
| `pin_hash` | TEXT | LENGTH = 60, NOT NULL | bcrypt hash of coordinator PIN |
| `coordinator_phone` | TEXT | CHECK (E.164: `^\+63\d{10}$`) | Coordinator phone for SMS |
| `status` | capacity_status | AUTO-COMPUTED | GREEN/YELLOW/RED based on % |
| `is_active` | BOOLEAN | DEFAULT true | Soft delete flag |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | AUTO-UPDATED | Last update timestamp |

**Indexes**:
- `idx_shelters_region` on `region` (for filtering)
- `idx_shelters_status` on `status` (for filtering)
- `idx_shelters_is_active` on `is_active` (for active-only queries)
- `idx_shelters_updated_at` on `updated_at` (for date range filtering)

**Triggers**:
- `trigger_update_shelter_status` - Automatically computes `status` and updates `updated_at` on INSERT/UPDATE

### SMS Logs Table

**Purpose**: Audit log for SMS alert delivery attempts.

**Columns**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique log entry identifier |
| `shelter_id` | UUID | FOREIGN KEY → shelters(id) ON DELETE CASCADE | Related shelter |
| `message` | TEXT | NOT NULL | SMS message content |
| `recipient` | TEXT | CHECK (E.164: `^\+63\d{10}$`) | Phone number that received SMS |
| `status` | TEXT | CHECK ('sent' OR 'failed') | Delivery status |
| `sent_at` | TIMESTAMPTZ | DEFAULT NOW() | Timestamp of send attempt |

**Indexes**:
- `idx_sms_logs_shelter_id` on `shelter_id` (for shelter-specific logs)
- `idx_sms_logs_sent_at` on `sent_at` (for time-based queries)

## Custom Types

### capacity_status ENUM

```sql
CREATE TYPE capacity_status AS ENUM ('GREEN', 'YELLOW', 'RED');
```

**Values**:
- `GREEN`: Occupancy < 70% of max_capacity
- `YELLOW`: Occupancy ≥ 70% and < 90% of max_capacity
- `RED`: Occupancy ≥ 90% of max_capacity

## Functions

### compute_capacity_status()

```sql
compute_capacity_status(current_occ INTEGER, max_cap INTEGER) RETURNS capacity_status
```

**Logic**:
1. If `max_cap = 0`, return `GREEN`
2. Calculate `percent = (current_occ / max_cap) * 100`
3. If `percent >= 90`, return `RED`
4. If `percent >= 70`, return `YELLOW`
5. Otherwise, return `GREEN`

**Properties**:
- IMMUTABLE (same inputs always produce same output)
- Used in trigger to auto-compute status

### update_shelter_status()

```sql
update_shelter_status() RETURNS TRIGGER
```

**Trigger Function**:
- Fires BEFORE INSERT OR UPDATE on `shelters`
- Sets `NEW.status = compute_capacity_status(NEW.current_occupancy, NEW.max_capacity)`
- Sets `NEW.updated_at = NOW()`
- Returns `NEW`

## Row Level Security (RLS)

### Shelters Table Policies

1. **"Public read access to shelters"**
   - **Type**: SELECT
   - **Role**: public (anon)
   - **Condition**: `is_active = true`
   - **Note**: Access via `public_shelters` view which excludes `pin_hash`

2. **"LGU admin full access to shelters"**
   - **Type**: ALL (SELECT, INSERT, UPDATE, DELETE)
   - **Role**: authenticated
   - **Condition**: `auth.jwt() ->> 'role' = 'lgu_admin'`

### SMS Logs Table Policies

1. **"LGU admin read access to sms_logs"**
   - **Type**: SELECT
   - **Role**: authenticated
   - **Condition**: `auth.jwt() ->> 'role' = 'lgu_admin'`

2. **"Service role write access to sms_logs"**
   - **Type**: INSERT
   - **Role**: service_role
   - **Condition**: true (always allowed)

## Views

### public_shelters

```sql
CREATE VIEW public_shelters AS
SELECT 
    id, name, address, region,
    latitude, longitude,
    max_capacity, current_occupancy,
    coordinator_phone, status,
    is_active, created_at, updated_at
FROM shelters
WHERE is_active = true;
```

**Purpose**: Provides public access to shelter data while excluding sensitive `pin_hash` column.

**Grants**: SELECT to `anon` and `authenticated` roles.

## Sample Data

The migration includes 3 sample shelters:

1. **Barangay Hall Evacuation Center**
   - Region: NCR
   - Capacity: 200, Occupancy: 50 (25% - GREEN)
   - Location: Manila (14.5995, 120.9842)

2. **City Sports Complex**
   - Region: NCR
   - Capacity: 500, Occupancy: 380 (76% - YELLOW)
   - Location: Quezon City (14.6760, 121.0437)

3. **Elementary School Gymnasium**
   - Region: NCR
   - Capacity: 300, Occupancy: 275 (91.7% - RED)
   - Location: Pasig (14.5764, 121.0851)

## Data Integrity Rules

### Constraint Summary

| Rule | Enforcement | Requirement |
|------|-------------|-------------|
| Occupancy non-negative | CHECK constraint | 9.1 |
| Occupancy ≤ capacity | CHECK constraint | 9.1 |
| Latitude range | CHECK constraint | 9.2 |
| Longitude range | CHECK constraint | 9.2 |
| Phone E.164 format | CHECK constraint | 9.3 |
| PIN hash length | CHECK constraint | 9.4 |
| Max capacity ≥ 0 | CHECK constraint | 9.5 |
| PIN hash only | RLS policy | 10.1, 10.2 |

### Validation Patterns

**E.164 Phone Format**: `^\+63\d{10}$`
- Must start with `+63` (Philippines country code)
- Followed by exactly 10 digits
- Example: `+639171234567`

**bcrypt Hash Format**: Exactly 60 characters
- Format: `$2b$10$...` (bcrypt algorithm identifier + salt + hash)
- Example: `$2b$10$rKZvVqVvVqVvVqVvVqVvVuO7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z`

## Migration File

**Location**: `supabase/migrations/20240101000000_initial_schema.sql`

**Execution Order**:
1. Enable extensions (uuid-ossp, pgcrypto)
2. Create custom types (capacity_status enum)
3. Create tables (shelters, sms_logs)
4. Create indexes
5. Create functions (compute_capacity_status, update_shelter_status)
6. Create triggers
7. Enable RLS
8. Create policies
9. Create views
10. Insert sample data

## Query Examples

### Get all active shelters with GREEN status
```sql
SELECT * FROM public_shelters WHERE status = 'GREEN';
```

### Get shelters in NCR region at critical capacity
```sql
SELECT * FROM public_shelters WHERE region = 'NCR' AND status = 'RED';
```

### Get SMS logs for a specific shelter
```sql
SELECT * FROM sms_logs WHERE shelter_id = 'abc-123' ORDER BY sent_at DESC;
```

### Update shelter occupancy (via Edge Function)
```sql
UPDATE shelters 
SET current_occupancy = 150, updated_at = NOW() 
WHERE id = 'abc-123';
-- Trigger automatically updates status
```

## Performance Considerations

- **Indexes** on frequently filtered columns (region, status, updated_at)
- **Trigger** computes status automatically (no client-side calculation needed)
- **View** pre-filters active shelters and excludes sensitive data
- **RLS** enforces security at database level (no application-level checks needed)

## Security Considerations

- **PIN hashes** never exposed via public API (excluded from view)
- **Service role** used by Edge Functions to bypass RLS for updates
- **JWT claims** used to verify LGU admin role
- **E.164 validation** prevents invalid phone numbers
- **Cascade delete** on SMS logs when shelter is deleted
