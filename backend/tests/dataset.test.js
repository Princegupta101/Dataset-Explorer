import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import Dataset from '../src/models/Dataset.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sampleDatasets = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/sampleDatasets.json'), 'utf-8')
);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Dataset.deleteMany({});
  await Dataset.insertMany(sampleDatasets);
});

describe('StatsUSA API Integration Tests (ES Modules)', () => {
  describe('GET /api/health', () => {
    it('should return 200 OK with server status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe('online');
    });
  });

  describe('GET /api/datasets', () => {
    it('should return paginated list of all datasets', async () => {
      const res = await request(app).get('/api/datasets?limit=10&page=1');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(10);
      expect(res.body.total).toBe(sampleDatasets.length);
      expect(res.body.pagination.totalPages).toBe(Math.ceil(sampleDatasets.length / 10));
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter datasets by category', async () => {
      const res = await request(app).get('/api/datasets?category=Healthcare');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      res.body.data.forEach((ds) => {
        expect(ds.category).toBe('Healthcare');
      });
    });

    it('should filter datasets by year', async () => {
      const res = await request(app).get('/api/datasets?year=2023');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      res.body.data.forEach((ds) => {
        expect(ds.year).toBe(2023);
      });
    });

    it('should sort datasets by name descending', async () => {
      const res = await request(app).get('/api/datasets?sortBy=name&sortOrder=desc');
      expect(res.statusCode).toBe(200);
      const names = res.body.data.map((d) => d.name);
      const sortedNames = [...names].sort().reverse();
      expect(names).toEqual(sortedNames);
    });

    it('should perform combined search and category filtering', async () => {
      const res = await request(app).get('/api/datasets?q=Census&category=Demographics');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      res.body.data.forEach((ds) => {
        expect(ds.category).toBe('Demographics');
      });
    });
  });

  describe('GET /api/datasets/search', () => {
    it('should return matching datasets for keyword search', async () => {
      const res = await request(app).get('/api/datasets/search?q=health');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBeGreaterThan(0);
    });

    it('should return empty list when no match is found', async () => {
      const res = await request(app).get('/api/datasets/search?q=NonExistentKeywordXYZ123');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(0);
      expect(res.body.data).toEqual([]);
    });
  });

  describe('GET /api/datasets/:id', () => {
    it('should return a specific dataset by valid ID', async () => {
      const allRes = await request(app).get('/api/datasets?limit=1');
      const testId = allRes.body.data[0]._id;

      const res = await request(app).get(`/api/datasets/${testId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(testId);
      expect(res.body.data.name).toBe(allRes.body.data[0].name);
    });

    it('should return 400 for invalid MongoDB ObjectId format', async () => {
      const res = await request(app).get('/api/datasets/invalid-id-123');
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Invalid dataset ID format');
    });

    it('should return 404 for non-existent valid ObjectId', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).get(`/api/datasets/${nonExistentId}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Dataset not found');
    });
  });

  describe('POST /api/datasets/:id/summarize', () => {
    it('should return AI-generated executive summary and insights', async () => {
      const allRes = await request(app).get('/api/datasets?limit=1');
      const testId = allRes.body.data[0]._id;

      const res = await request(app).post(`/api/datasets/${testId}/summarize`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('executiveSummary');
      expect(res.body.data).toHaveProperty('keyTakeaways');
      expect(res.body.data).toHaveProperty('suggestedAnalyticalQuestions');
    });
  });

  describe('GET /api/datasets/categories and /stats', () => {
    it('should return distinct category aggregations', async () => {
      const res = await request(app).get('/api/datasets/categories');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.count).toBeGreaterThan(0);
    });

    it('should return platform stats', async () => {
      const res = await request(app).get('/api/datasets/stats');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalDatasets).toBe(sampleDatasets.length);
      expect(res.body.data.categories.length).toBeGreaterThan(0);
    });
  });
});
