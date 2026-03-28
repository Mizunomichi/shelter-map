# ShelterMap - How to View Evacuation Centers

## 🗺️ Viewing Evacuation Centers on the Map

The map now displays **6 sample evacuation centers** across Metro Manila, Philippines!

### How to See the Centers:

1. **Open the app**: Go to `http://localhost:5174/`
2. **Look at the map**: You'll see colored circular markers
3. **Click any marker**: A popup will show:
   - Shelter name
   - Address
   - Current occupancy / Maximum capacity
   - Status (GREEN/YELLOW/RED)

### 📍 Sample Evacuation Centers:

| # | Name | Location | Capacity | Occupancy | Status |
|---|------|----------|----------|-----------|--------|
| 1 | Barangay Hall Evacuation Center | Manila | 200 | 50 (25%) | 🟢 GREEN |
| 2 | City Sports Complex | Quezon City | 500 | 380 (76%) | 🟡 YELLOW |
| 3 | Elementary School Gymnasium | Pasig | 300 | 275 (92%) | 🔴 RED |
| 4 | Community Center Makati | Makati | 150 | 45 (30%) | 🟢 GREEN |
| 5 | Taguig Convention Center | BGC, Taguig | 800 | 620 (78%) | 🟡 YELLOW |
| 6 | Marikina Sports Center | Marikina | 400 | 95 (24%) | 🟢 GREEN |

### 🎨 Understanding the Colors:

The markers use a color-coded system to show capacity status:

- **🟢 GREEN** - Available (<70% full)
  - Plenty of space available
  - Safe to direct evacuees here
  
- **🟡 YELLOW** - Limited (70-89% full)
  - Getting crowded
  - Consider alternative shelters
  
- **🔴 RED** - Full (≥90% full)
  - Nearly at capacity
  - Avoid sending more evacuees

### 📊 Map Legend:

At the bottom of the map, you'll see a legend explaining the color codes:
- Available (<70%)
- Limited (70-89%)
- Full (≥90%)

### 🔍 Map Features:

1. **Zoom**: Use mouse wheel or +/- buttons
2. **Pan**: Click and drag to move around
3. **Click markers**: View detailed shelter information
4. **Popup info**: Shows real-time occupancy data

### 📱 Interactive Popups:

When you click a marker, you'll see:
```
┌─────────────────────────────────┐
│ Barangay Hall Evacuation Center│
│ 123 Main St, Manila             │
│                                  │
│ Occupancy:           50 / 200   │
│                                  │
│         [  GREEN  ]              │
└─────────────────────────────────┘
```

### 🌍 Map Coverage:

The map is centered on **Manila, Philippines** (14.5995°N, 120.9842°E) with a zoom level showing the entire Metro Manila area.

### 💡 Tips:

1. **Zoom in** to see street-level details
2. **Zoom out** to see the overall distribution
3. **Click multiple markers** to compare shelters
4. **Look for green markers** when directing evacuees
5. **Avoid red markers** - they're nearly full

### 🔄 Real-time Updates:

When connected to Supabase (the backend database):
- Markers update automatically when capacity changes
- No page refresh needed
- Live monitoring of all shelters

### 📝 Current Status:

Right now, you're seeing **demo data** because Supabase isn't running. You'll see a blue notification at the top of the map:

```
📍 Showing demo evacuation centers (Supabase not connected)
```

This is normal! The demo data lets you explore the interface without setting up the full backend.

### 🚀 Next Steps:

To see real data and enable updates:

1. **Install Docker Desktop** (required for Supabase)
2. **Install Supabase CLI**: `npm install -g supabase`
3. **Start Supabase**: `supabase start`
4. **Apply migrations**: `supabase db push`
5. **Refresh the page** - markers will load from the database

### 🎯 Use Cases:

**For the Public:**
- Find nearest evacuation center
- Check if shelter has space
- Plan evacuation route

**For Coordinators:**
- Monitor shelter capacity
- Update occupancy numbers
- See real-time status

**For LGU Admins:**
- Overview of all shelters
- Identify overcrowded centers
- Coordinate relief operations

### 📍 Geographic Distribution:

The sample shelters are spread across Metro Manila:
- **Manila** - City center
- **Quezon City** - North
- **Pasig** - East
- **Makati** - Business district
- **Taguig/BGC** - South
- **Marikina** - Northeast

This gives you a realistic view of how the system would work during an actual disaster response.

---

**Enjoy exploring the map!** 🗺️✨
