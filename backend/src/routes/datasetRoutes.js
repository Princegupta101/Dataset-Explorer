import express from 'express';
import {
  getDatasets,
  searchDatasets,
  getDatasetById,
  getCategories,
  getStats,
  summarizeDataset,
} from '../controllers/datasetController.js';

const router = express.Router();

router.get('/search', searchDatasets);
router.get('/categories', getCategories);
router.get('/stats', getStats);
router.get('/', getDatasets);
router.get('/:id', getDatasetById);
router.post('/:id/summarize', summarizeDataset);

export default router;
