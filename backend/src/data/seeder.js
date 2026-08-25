import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Dataset from '../models/Dataset.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const seedDatasets = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/statsusa';
    await mongoose.connect(mongoURI);

    const dataPath = path.join(__dirname, 'sampleDatasets.json');
    const datasets = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    await Dataset.deleteMany({});
    const inserted = await Dataset.insertMany(datasets);

    console.log(`Successfully seeded ${inserted.length} datasets.`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeder failed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatasets();
}

export default seedDatasets;
