import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_FILE = join(__dirname, 'data.json');

class JsonDb {
  constructor() {
    if (!fs.existsSync(DB_FILE)) {
      this.data = {
        leads: [],
        estimations: [],
        appliance_presets: [
          { name: 'LED TV', watt: 150, surgeFactor: 1.2 },
          { name: 'Refrigerator', watt: 200, surgeFactor: 3.0 },
          { name: 'Air Conditioner', watt: 1500, surgeFactor: 2.5 },
          { name: 'Water Pump', watt: 750, surgeFactor: 3.5 },
          { name: 'Washing Machine', watt: 500, surgeFactor: 2.0 }
        ]
      };
      this.save();
    } else {
      this.data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
  }

  save() {
    fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2));
  }

  insert(table, item) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const newItem = { id, ...item, created_at: new Date().toISOString() };
    this.data[table].push(newItem);
    this.save();
    return newItem;
  }

  find(table, predicate) {
    return this.data[table].find(predicate);
  }

  findAll(table, predicate) {
    if (!predicate) return this.data[table];
    return this.data[table].filter(predicate);
  }
}

export const db = new JsonDb();
