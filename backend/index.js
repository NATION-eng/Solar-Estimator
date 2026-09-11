import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { db } from "./database.js";
import { solarService } from "./services/solarService.js";
import { energyModel } from "./services/energyModel_enhanced.js";

const app = express();
const PORT = process.env.PORT || 5050;

/* ================= MIDDLEWARE ================= */
// CORS configuration for local development and production deployments
const allowedOrigins = [
  'http://localhost:5180',
  'http://127.0.0.1:5180',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://solar-estimator.vercel.app',
  'https://solar-estimator-*.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
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
      callback(null, true); // Permissive in dev fallback
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
    const { propertyType, appliances, hours, contact, address, batteryType = 'lithium' } = req.body;

    if (!appliances || !hours || !address) {
      return res.status(400).json({ error: "Missing required inputs (appliances, hours, address)" });
    }

    // 1. Geolocation & Solar Data
    const location = await solarService.getCoordinates(address);
    if (!location) {
      return res.status(404).json({ error: "Could not find address" });
    }

    const solarData = await solarService.getSolarYield(location.lat, location.lon, location.cachedPsh);

    // 2. Technical Sizing using Enhanced Energy Model
    const result = energyModel.calculateSystem(
      appliances, 
      Number(hours), 
      solarData.peakSunHours,
      batteryType
    );

    // 3. Persist Lead & Estimation (CRM Logic)
    let estimationId = Date.now();
    try {
      const lead = db.insert('leads', {
        name: contact?.name || "Website Visitor",
        phone: contact?.phone || "Not provided",
        address: location.displayName || address,
        property_type: propertyType || "residential",
        status: 'estimated'
      });

      const estimation = db.insert('estimations', {
        lead_id: lead.id,
        ...result.technical,
        estimated_price: result.financial.estimatedPriceNaira,
        lat: location.lat,
        lon: location.lon
      });
      estimationId = estimation.id;
    } catch (dbErr) {
      console.warn("Lead storage warning (non-fatal):", dbErr.message);
    }

    // 4. Return Comprehensive Blueprint Result
    res.json({
      id: estimationId,
      location: {
        address: location.displayName,
        psh: solarData.peakSunHours
      },
      batteryType,
      ...result.technical,
      ...result.financial,
      environmental: result.environmental,
      recommendations: result.recommendations,
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
