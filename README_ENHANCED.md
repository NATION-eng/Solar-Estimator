# 🌞 Solar System Estimator - Professional Edition

**Version 2.0** | MasterviewCEL Energy Solutions

A sophisticated, production-ready solar energy sizing calculator with real-world engineering calculations, comprehensive appliance database, environmental impact analysis, and financial modeling.

---

## ✨ Features

### 🎯 Core Functionality
- **Real-time Solar System Sizing** - Accurate calculations based on IEEE and industry standards
- **Comprehensive Appliance Database** - 60+ pre-configured appliances across 9 categories
- **Smart Surge Detection** - Automatic surge factor calculation for motors, compressors, and heating elements
- **Geolocation Integration** - Address-to-coordinates with real solar irradiance data
- **Multi-Battery Chemistry Support** - Lithium, Gel, AGM, and Tubular battery options

### 📊 Advanced Analytics
- **24-Hour Load Profiling** - Visual representation of energy consumption patterns
- **Environmental Impact Calculator** - CO₂ savings, tree equivalents, lifetime offset
- **ROI & Payback Analysis** - Interactive savings calculator with grid cost comparison
- **Financing Options** - Multiple payment plans with EMI calculations
- **System Health Indicators** - Battery life estimation and replacement forecasting

### 💡 User Experience
- **Autocomplete Appliance Search** - Type-ahead search with category filters
- **Progress Tracking** - Real-time assessment completion indicator
- **Responsive Design** - Mobile-first, works seamlessly on all devices
- **Dark Mode Glassmorphism UI** - Premium aesthetic with smooth animations
- **One-Click PDF Export** - Professional quotation generation

### 🔧 Technical Excellence
- **Accurate Surge Calculations** - Motor loads handled correctly (5x surge for pumps)
- **System Voltage Optimization** - Automatic 12V/24V/48V selection
- **MPPT Controller Sizing** - Proper charge controller capacity with safety margins
- **Inverter Peak Handling** - Continuous vs surge load differentiation
- **Battery Depth-of-Discharge** - Chemistry-specific DOD calculations

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd solar-estimator

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Running Locally

```bash
# Terminal 1: Start the backend API
npm run server

# Terminal 2: Start the frontend dev server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📁 Project Structure

```
solar-estimator/
├── backend/
│   ├── index.js                 # Express API server
│   ├── services/
│   │   ├── energyModel.js       # Solar sizing calculations
│   │   └── solarService.js      # Geolocation & solar data
│   ├── database.js              # Simple JSON database
│   └── package.json
├── src/
│   ├── components/
│   │   ├── Estimator.tsx        # Main form component
│   │   ├── AppResult.tsx        # Results display
│   │   ├── Hero.tsx             # Landing section
│   │   ├── LoadProfileChart.tsx # 24-hour load visualization
│   │   ├── SavingsCalculator.tsx# Financial analysis
│   │   ├── EnvironmentalImpactCard.tsx
│   │   └── ApplianceSelector.tsx# Smart appliance picker
│   ├── data/
│   │   └── applianceDatabase.ts # 60+ appliances catalog
│   ├── types/
│   │   └── index.ts             # TypeScript definitions
│   ├── utils/
│   │   └── helpers.ts           # Utility functions
│   ├── styles/
│   │   └── design-system.css    # Design tokens & themes
│   ├── App.jsx
│   └── main.jsx
├── dist/                        # Production build
├── package.json
├── vite.config.js
└── README.md
```

---

## 🧮 Calculation Methodology

### System Sizing Algorithm

1. **Load Analysis**
   - Total steady-state wattage
   - Peak surge calculation (motor factor × wattage)
   - Daily energy consumption (Wh)

2. **Inverter Sizing**
   ```
   Continuous Rating = Total Load × 1.25  (25% safety margin)
   Surge Capacity = Max Surge × 0.6       (60% of peak rating)
   Final Inverter = MAX(Continuous, Surge)
   ```

3. **Solar Panel Array**
   ```
   System Efficiency = 0.92 × 0.97 × 0.98 × 0.95  (inverter, wiring, MPPT, panel)
   Required Watts = Daily Energy ÷ Peak Sun Hours ÷ Efficiency
   Panel Quantity = CEIL(Required Watts ÷ 450W)
   ```

4. **Battery Bank**
   ```
   Autonomy = 1.25 days (~30 hours backup)
   Capacity (Wh) = Daily Energy × Autonomy ÷ DOD ÷ Inverter Efficiency
   Capacity (Ah) = Capacity (Wh) ÷ System Voltage
   ```

5. **Charge Controller**
   ```
   Current (A) = Total Panel Wattage ÷ System Voltage × 1.25
   ```

### Surge Factors (Industry Standard)
| Appliance Type | Surge Factor |
|---|---|
| Water Pumps, Compressors | 5.0x |
| Drill, Grinder | 4.5x |
| Fans, Motors | 4.0x |
| Air Conditioners | 3.5x |
| Refrigerators, Freezers | 3.0x |
| Heating Elements, Irons | 1.2x |
| TVs, Computers, LEDs | 1.1x |

---

## 🌍 Environmental Impact

The system calculates:
- **CO₂ Savings**: Based on 0.5 kg CO₂/kWh Nigerian grid factor
- **Tree Equivalence**: 1 tree absorbs ~21 kg CO₂/year
- **Coal Avoidance**: 1 kg coal = ~2.5 kg CO₂
- **25-Year Lifetime Offset**: Total emissions prevented

---

## 💰 Financial Modeling

### Cost Components (Nigerian Market 2026)
- **Solar Panels**: ₦280,000 per 450W panel
- **Inverter**: ₦550 per watt (pure sine wave)
- **Batteries**: 
  - Lithium: ₦1,200/Ah
  - Gel: ₦450/Ah
  - AGM: ₦380/Ah
  - Tubular: ₦320/Ah
- **MPPT Controller**: ₦2,500 per amp
- **Installation**: ₦25,000/panel + ₦200,000 base
- **Accessories**: ₦150,000 (cables, breakers, monitoring)

### Payback Calculation
```
Annual Grid Cost = Daily Energy × Grid Tariff × 365
Annual Solar Cost = System Cost × 0.015  (1.5% maintenance)
Annual Savings = Grid Cost - Solar Cost
Payback Period = System Cost ÷ Annual Savings
```

---

## 🔧 API Endpoints

### POST `/estimate`
Calculate solar system requirements

**Request Body:**
```json
{
  "propertyType": "home",
  "address": "Lagos, Nigeria",
  "hours": 8,
  "appliances": [
    {
      "name": "LED TV 43\"",
      "watt": 65,
      "quantity": 1,
      "hours": 5
    }
  ],
  "contact": {
    "name": "John Doe",
    "phone": "08012345678",
    "email": "john@example.com"
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "location": {
    "address": "Lagos, Lagos, Nigeria",
    "psh": 4.52
  },
  "totalLoadWatts": 1250,
  "maxSurgeWatts": 3750,
  "dailyEnergyWh": 10000,
  "recommendedInverter": 5000,
  "systemVoltage": 24,
  "batteryAh": 520,
  "panelQuantity": 8,
  "chargeControllerAmps": 150,
  "estimatedPriceNaira": 4250000,
  "paybackYears": 4.2,
  "environmental": {
    "co2SavedAnnually": 1825,
    "treesEquivalent": 87,
    "coalAvoided": 730,
    "lifetimeOffset": 45625
  },
  "recommendations": [...]
}
```

---

## 📱 Responsive Design

- **Mobile** (<640px): Single column, stacked cards, full-width buttons
- **Tablet** (641-1024px): Two-column grids, optimized touch targets
- **Desktop** (>1024px): Three-column grids, hover effects, advanced layout

---

## 🎨 Design System

### Color Palette
- **Primary (Gold)**: `#fbbf24`
- **Accent (Sky)**: `#38bdf8`
- **Success (Emerald)**: `#10b981`
- **Background**: `#020617` (Deep Navy)
- **Glass Cards**: `rgba(15, 23, 42, 0.7)`

### Typography
- **Display**: Outfit (700-900 weight)
- **Body**: Inter (400-500 weight)

### Animations
- Float effect on cards
- Glow pulse on primary elements
- Smooth transitions (cubic-bezier easing)

---

## 🚢 Deployment

### Production Build

```bash
# Build frontend
npm run build

# The dist/ folder contains optimized static files
# Deploy to any static hosting (Vercel, Netlify, etc.)
```

### Backend Deployment

```bash
# Set environment variables
export PORT=5050
export NODE_ENV=production

# Run backend
cd backend
node index.js
```

### Environment Variables
```env
PORT=5050
NODE_ENV=production
DATABASE_PATH=./data.json
CORS_ORIGIN=https://yourdomain.com
```

---

## 🔒 Security Considerations

1. **Rate Limiting**: 100 requests per 15 minutes per IP
2. **CORS**: Configured for specific origins
3. **Input Validation**: All user inputs sanitized
4. **API Key Protection**: Geocoding APIs use server-side keys only
5. **SQL Injection Prevention**: Using parameterized queries (when applicable)

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Form validation (empty fields, invalid numbers)
- [ ] Appliance addition/removal
- [ ] Surge calculation accuracy
- [ ] PDF generation
- [ ] Mobile responsiveness
- [ ] Backend API connectivity
- [ ] Geolocation accuracy
- [ ] Solar data fetching

### Sample Test Cases
```javascript
// Test Case 1: Small residential load
Input: 2 LED bulbs (9W each), 1 small fridge (120W), 6 hours/day
Expected: ~1kVA inverter, 24V system, 2-3 panels

// Test Case 2: Heavy motor load
Input: 1 water pump (746W), surge factor 5x
Expected: Inverter >= 3730W surge capacity

// Test Case 3: Mixed commercial load
Input: 5 workstations, 1 AC, office lighting
Expected: 48V system, >5kVA inverter
```

---

## 📊 Performance Optimization

- **Code Splitting**: Vite automatically chunks large components
- **Lazy Loading**: Dynamic imports for heavy visualizations
- **Image Optimization**: SVG icons, no heavy images
- **Memoization**: useMemo for expensive calculations
- **Debounced Search**: Reduces API calls during typing

---

## 🐛 Troubleshooting

### Common Issues

**"Failed to fetch" error**
- Ensure backend is running on port 5050
- Check CORS configuration
- Verify network connectivity

**Geolocation not working**
- Check address format (include country)
- Verify OpenStreetMap API accessibility
- Fallback to manual coordinates if needed

**PDF generation fails**
- Check jsPDF version compatibility
- Ensure all data fields are present
- Verify autoTable plugin loaded

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is proprietary software © 2026 MasterviewCEL Energy Solutions. All rights reserved.

---

## 📞 Support

- **Website**: www.masterviewcel.com
- **Email**: support@masterviewcel.com
- **Documentation**: [Link to detailed docs]

---

## 🙏 Acknowledgments

- **Open-Meteo**: Solar irradiance data
- **OpenStreetMap**: Geolocation services
- **React**: UI framework
- **Vite**: Build tool
- **jsPDF**: PDF generation

---

## 📈 Roadmap

- [ ] User accounts & saved estimates
- [ ] Multi-site comparison tool
- [ ] Integration with inverter manufacturer APIs
- [ ] Real-time solar yield tracking
- [ ] Mobile app (React Native)
- [ ] WhatsApp quotation sharing
- [ ] Payment gateway integration
- [ ] Installer marketplace

---

**Built with ❤️ by MasterviewCEL Engineering Team**

*Powering Africa, One System at a Time* ⚡🌍
