# 🏠 ShelterMap - Real-Time Evacuation Center Monitoring

A mobile-first Progressive Web App (PWA) for real-time evacuation center capacity monitoring during disaster events. Built with TypeScript, Leaflet, and Supabase.

![ShelterMap Demo](https://img.shields.io/badge/Status-Demo-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Node](https://img.shields.io/badge/Node-18%2B-brightgreen)

## 🌟 Features

### 🗺️ Interactive Map
- **Real-time shelter markers** with color-coded capacity status
- **26 demo evacuation centers** across Metro Manila and Cebu City
- **Interactive popups** showing shelter details and occupancy
- **Responsive design** optimized for mobile and desktop

### 🎨 Modern UI
- Beautiful gradient-based design
- Smooth animations and transitions
- Professional card-based layouts
- Mobile-first responsive interface

### 🔐 Admin Authentication
- Secure login system for administrators
- Session-based authentication
- Protected admin routes
- User info display with logout functionality

**Demo Credentials:**
- Username: `Admin`
- Password: `12345`

### 📊 Capacity Status System
- 🟢 **GREEN** - Available (<70% capacity)
- 🟡 **YELLOW** - Limited (70-89% capacity)
- 🔴 **RED** - Full (≥90% capacity)

### 📍 Coverage Areas

**Metro Manila (6 shelters):**
- Barangay Hall Evacuation Center
- City Sports Complex
- Elementary School Gymnasium
- Community Center Makati
- Taguig Convention Center
- Marikina Sports Center

**Cebu City (20 shelters):**
- Cebu City Sports Center
- Abellana National School Gym
- University of Cebu Main Gym
- Barangay Mabolo Sports Complex
- And 16 more across different barangays

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **Python 3.11+** - [Download](https://www.python.org/)
- **Supabase CLI** (optional for full backend) - [Install Guide](https://supabase.com/docs/guides/cli)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/shelter-map.git
cd shelter-map
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:5173
```

That's it! The app will run with demo data (no backend required).

## 📁 Project Structure

```
shelter-map/
├── frontend/              # PWA client (Vite + TypeScript)
│   ├── src/
│   │   ├── components/   # UI components
│   │   │   ├── MapView.ts
│   │   │   ├── Login.ts
│   │   │   ├── CoordinatorUpdateForm.ts
│   │   │   └── AdminDashboard.ts
│   │   ├── lib/          # Utilities
│   │   │   ├── supabase.ts
│   │   │   └── serviceWorker.ts
│   │   ├── main.ts       # Entry point
│   │   └── style.css     # Global styles
│   ├── public/           # Static assets
│   ├── package.json
│   └── vite.config.ts
│
├── supabase/             # Backend (Edge Functions + Database)
│   ├── functions/        # Edge Functions (Deno)
│   │   ├── update-shelter/
│   │   ├── send-sms-alert/
│   │   └── utils.py
│   └── migrations/       # Database schema
│
├── .kiro/                # Kiro AI specs
│   └── specs/
│       └── shelter-map/
│
└── scripts/              # Utility scripts
```

## 🎯 Usage

### Viewing the Map

1. Navigate to the home page (`/`)
2. See color-coded markers for all evacuation centers
3. Click any marker to view:
   - Shelter name and address
   - Current occupancy / Maximum capacity
   - Status (GREEN/YELLOW/RED)

### Admin Login

1. Click "Admin" in the navigation
2. Enter credentials:
   - Username: `Admin`
   - Password: `12345`
3. Access the admin dashboard

### Coordinator Updates

1. Navigate to "Update" page (`/coordinator`)
2. Select a shelter
3. Enter PIN and current occupancy
4. Submit update (works offline with queue)

## 🛠️ Tech Stack

### Frontend
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Leaflet** - Interactive maps
- **Chart.js** - Data visualization
- **Workbox** - Service worker and PWA

### Backend
- **Supabase** - PostgreSQL, Realtime, Auth, Edge Functions
- **Python** - Backend utilities and capacity calculation
- **Deno** - Edge Functions runtime

### Testing
- **Vitest** - Unit testing
- **fast-check** - Property-based testing

## 📊 System Statistics

**Total Coverage:**
- 26 evacuation centers
- 2 regions (NCR + Region VII)
- 11,530 total capacity
- 4,435 current occupancy (demo data)
- 38.4% overall utilization

**Cebu City:**
- 20 shelters
- 8,030 capacity
- 11 GREEN, 5 YELLOW, 4 RED

**Metro Manila:**
- 6 shelters
- 3,500 capacity
- 3 GREEN, 2 YELLOW, 1 RED

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### PWA Configuration

Edit `frontend/vite.config.ts` to customize:
- App name and description
- Theme colors
- Icon sizes
- Caching strategies

## 🌐 Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `dist/` folder to your hosting provider

### Backend (Supabase)

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Link your project:
```bash
supabase link --project-ref your-project-ref
```
3. Push migrations:
```bash
supabase db push
```
4. Deploy Edge Functions:
```bash
supabase functions deploy
```

## 📱 PWA Features

- **Offline Support** - Works without internet connection
- **Install to Home Screen** - Add to mobile home screen
- **Background Sync** - Queues updates when offline
- **Push Notifications** - (Coming soon)
- **Cached Map Tiles** - Fast loading even offline

## 🧪 Testing

### Run Unit Tests
```bash
cd frontend
npm test
```

### Run Python Tests
```bash
cd supabase/functions
source venv/bin/activate  # On Windows: .\venv\Scripts\Activate.ps1
pytest test_utils.py -v
```

## 📖 Documentation

- [Setup Guide](SETUP.md) - Detailed setup instructions
- [Map Guide](MAP_GUIDE.md) - How to use the map
- [Cebu Shelters](CEBU_SHELTERS.md) - Cebu City shelter details
- [UI Improvements](UI_IMPROVEMENTS.md) - UI design documentation
- [Database Schema](DATABASE_SCHEMA.md) - Database structure

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Leaflet** - For the amazing mapping library
- **Supabase** - For the backend infrastructure
- **OpenStreetMap** - For the map tiles
- **Kiro AI** - For development assistance

## 📧 Contact

For questions or support, please open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Real-time SMS alerts via Semaphore PH
- [ ] Admin dashboard with charts and filters
- [ ] CSV export functionality
- [ ] Multi-language support (English, Filipino, Cebuano)
- [ ] Dark mode
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] More regions (Davao, Iloilo, Baguio)

## 📸 Screenshots

### Map View
![Map View](docs/screenshots/map-view.png)

### Login Page
![Login Page](docs/screenshots/login.png)

### Admin Dashboard
![Admin Dashboard](docs/screenshots/admin.png)

---

**Built with ❤️ for disaster resilience in the Philippines**
