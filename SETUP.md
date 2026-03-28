# ShelterMap Setup Guide

This guide walks you through setting up the ShelterMap development environment.

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.11+ ([Download](https://www.python.org/))
- **Supabase CLI** ([Installation Guide](https://supabase.com/docs/guides/cli))
- **Git** (for version control)

## Quick Start

### 1. Run Setup Script

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

This script will:
- Create Python virtual environment
- Install Python dependencies (bcrypt, supabase-py)
- Install frontend dependencies (Vite, Leaflet, Chart.js, Workbox)
- Create `.env` file from template

### 2. Initialize Supabase

```bash
# Initialize Supabase in the project
supabase init

# Start local Supabase instance
supabase start
```

This will start:
- PostgreSQL database (port 54322)
- Supabase Studio (port 54323)
- API Gateway (port 54321)
- Realtime server

### 3. Apply Database Migrations

```bash
# Apply the initial schema migration
supabase db push
```

This creates:
- `shelters` table with constraints and indexes
- `sms_logs` table
- Row Level Security (RLS) policies
- Capacity status computation function
- Sample test data

### 4. Configure Environment Variables

Update `frontend/.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<your-anon-key-from-supabase-start>
```

Get the anon key from the output of `supabase start`.

### 5. Start Development Server

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
shelter-map/
├── frontend/                 # PWA client
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── lib/             # Utilities (Supabase, service worker)
│   │   ├── main.ts          # Entry point
│   │   └── style.css        # Global styles
│   ├── public/              # Static assets
│   ├── package.json
│   └── vite.config.ts       # Vite + PWA configuration
│
├── supabase/
│   ├── functions/           # Edge Functions (Deno)
│   │   ├── update-shelter/  # PIN verification & update
│   │   ├── send-sms-alert/  # SMS alerts via Semaphore PH
│   │   └── requirements.txt # Python dependencies
│   ├── migrations/          # Database schema
│   └── config.toml          # Supabase configuration
│
└── scripts/
    └── setup.sh             # Automated setup script
```

## Database Schema

### Shelters Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | NOT NULL |
| address | TEXT | NOT NULL |
| region | TEXT | NOT NULL |
| latitude | DECIMAL(10,8) | -90 to 90 |
| longitude | DECIMAL(11,8) | -180 to 180 |
| max_capacity | INTEGER | >= 0 |
| current_occupancy | INTEGER | 0 to max_capacity |
| pin_hash | TEXT | 60 chars (bcrypt) |
| coordinator_phone | TEXT | E.164 format |
| status | ENUM | GREEN/YELLOW/RED |
| is_active | BOOLEAN | Default true |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto |

### SMS Logs Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary key |
| shelter_id | UUID | Foreign key |
| message | TEXT | NOT NULL |
| recipient | TEXT | E.164 format |
| status | TEXT | 'sent' or 'failed' |
| sent_at | TIMESTAMPTZ | Auto |

## Row Level Security (RLS)

- **Public role**: Can SELECT from `public_shelters` view (excludes `pin_hash`)
- **LGU admin role**: Full access to all tables
- **Service role**: Edge Functions can bypass RLS for updates

## Testing the Setup

### 1. View Shelters in Supabase Studio

Open `http://localhost:54323` and navigate to the Table Editor to see the sample shelters.

### 2. Test the Map View

Navigate to `http://localhost:5173` to see the map with color-coded markers.

### 3. Test Coordinator Update

Navigate to `http://localhost:5173/coordinator` and submit an update using:
- Any shelter from the dropdown
- PIN: any 4-8 digit number (placeholder verification)
- Occupancy: any valid number

## Next Steps

After completing Task 1 setup:

- **Task 2**: Implement capacity status computation with property tests
- **Task 3**: Implement PIN verification with bcrypt
- **Task 4**: Integrate SMS alerts via Semaphore PH
- **Task 5**: Backend testing checkpoint
- **Task 6-14**: Frontend components, offline support, admin dashboard

## Troubleshooting

### Supabase won't start
- Check if ports 54321-54323 are available
- Run `supabase stop` and `supabase start` again

### Frontend build errors
- Delete `node_modules` and run `npm install` again
- Check Node.js version (must be 18+)

### Python dependencies fail
- Ensure Python 3.11+ is installed
- Activate virtual environment: `source venv/bin/activate`
- Upgrade pip: `pip install --upgrade pip`

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Leaflet Documentation](https://leafletjs.com/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developer.chrome.com/docs/workbox/)
