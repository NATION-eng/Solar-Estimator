import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { db } from "./database.js";
import { solarService } from "./services/solarService.js";
import { energyModel } from "./services/energyModel.js";

const app = express();
const PORT = 5050;

/* ================= MIDDLEWARE ================= */
// CORS configuration for production
const allowedOrigins = [
  'http://localhost:5180',
  'http://127.0.0.1:5180',
  'https://solar-estimator.vercel.app',
  'https://solar-estimator-*.vercel.app', // Preview deployments
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches pattern
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const pattern = new RegExp('^' + allowed.replace(/\*/g, '.*') + '$');
        return pattern.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Rate limiting to protect geocoding/weather API usage
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

/* ================= ROUTES ================= */

/**
 * Main Estimation API
 * Input: { propertyType, appliances, hours, contact, address }
 */
app.post("/estimate", async (req, res) => {
  try {
    const { propertyType, appliances, hours, contact, address } = req.body;

    if (!appliances || !hours || !address) {
      return res.status(400).json({ error: "Missing required inputs (appliances, hours, address)" });
    }

    // 1. Geolocation & Solar Data
    const location = await solarService.getCoordinates(address);
    if (!location) {
      return res.status(404).json({ error: "Could not find address" });
    }

    const solarData = await solarService.getSolarYield(location.lat, location.lon);

    // 2. Technical Sizing
    const result = energyModel.calculateSystem(appliances, Number(hours), solarData.peakSunHours);

    // 3. Persist Lead & Estimation (CRM Logic)
    const lead = db.insert('leads', {
      name: contact?.name || "Anonymous",
      phone: contact?.phone,
      address: address, // Standardized address
      property_type: propertyType,
      status: 'estimated'
    });

    const estimation = db.insert('estimations', {
      lead_id: lead.id,
      ...result.technical,
      estimated_price: result.financial.estimatedPriceNaira,
      lat: location.lat,
      lon: location.lon
    });

    // 4. Return Comprehensive Result
    res.json({
      id: estimation.id,
      location: {
        address: location.displayName,
        psh: solarData.peakSunHours
      },
      ...result.technical,
      ...result.financial,
      recommendedInverterW: result.technical.recommendedInverter, // map back to frontend key
    });

  } catch (error) {
    console.error("Estimation error:", error.message);
    res.status(500).json({ error: "High-fidelity estimation failed. Check logs." });
  }
});

/* ================= START SERVER ================= */
app.get("/health", (req, res) => res.json({ status: "ok", message: "Solar API is reaching the internet" }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Exquisite Solar API running on http://127.0.0.1:${PORT}`);
  console.log(`🔗 Try visiting http://127.0.0.1:${PORT}/health in your browser`);
});
