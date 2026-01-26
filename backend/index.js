import express from "express";
import cors from "cors";
import fs from "fs";
import calculator from "./calculator.js";

const app = express();
const PORT = 5000;

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= UTILITY ================= */

// Ensure leads.json exists
const leadsFile = "./leads.json";
if (!fs.existsSync(leadsFile)) {
  fs.writeFileSync(leadsFile, JSON.stringify([]));
}

/* ================= ROUTES ================= */

app.post("/estimate", (req, res) => {
  try {
    console.log("Received body:", req.body);

    const { propertyType, appliances, hours, contact } = req.body;

    if (!propertyType || !appliances || appliances.length === 0 || !hours) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Convert all numeric fields to numbers
    const numericAppliances = appliances.map((a) => ({
      name: a.name,
      watt: Number(a.watt),
      quantity: Number(a.quantity),
    }));

    const numericHours = Number(hours);

    const result = calculator({
      appliances: numericAppliances,
      hours: numericHours,
    });

    // Save lead
    const leads = JSON.parse(fs.readFileSync(leadsFile, "utf-8"));
    leads.push({
      propertyType,
      contact,
      appliances: numericAppliances,
      hours: numericHours,
      result,
      createdAt: new Date().toISOString(),
    });
    fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));

    res.json(result);
  } catch (error) {
    console.error("Estimation error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`✅ Solar Estimator API running on http://localhost:${PORT}`);
});
