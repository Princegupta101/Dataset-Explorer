import mongoose from 'mongoose';
import Dataset from '../models/Dataset.js';
import { generateDatasetSummary } from '../utils/aiSummarizer.js';

export const getDatasets = async (req, res, next) => {
  try {
    const {
      q,
      search,
      category,
      geography,
      year,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};
    const term = (q || search || '').trim();

    if (term) {
      const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { name: regex },
        { description: regex },
        { source: regex },
        { category: regex },
        { geography: regex },
        { tags: { $in: [regex] } },
      ];
    }

    if (category && category !== 'All') {
      const categories = category.split(',').map((c) => c.trim());
      query.category =
        categories.length === 1
          ? new RegExp(`^${categories[0]}$`, 'i')
          : { $in: categories.map((c) => new RegExp(`^${c}$`, 'i')) };
    }

    if (geography && geography !== 'All') {
      query.geography = new RegExp(`^${geography.trim()}$`, 'i');
    }

    if (year && year !== 'All') {
      const parsedYear = parseInt(year, 10);
      if (!isNaN(parsedYear)) {
        query.year = parsedYear;
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const allowedSortFields = ['name', 'year', 'createdAt', 'category', 'source', 'recordsCount'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const sortDirection = sortOrder.toLowerCase() === 'desc' ? -1 : 1;

    const total = await Dataset.countDocuments(query);
    const datasets = await Dataset.find(query)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      count: datasets.length,
      total,
      pagination: {
        currentPage: pageNum,
        totalPages,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      filtersApplied: {
        search: term || null,
        category: category || null,
        geography: geography || null,
        year: year || null,
        sortBy: sortField,
        sortOrder: sortDirection === 1 ? 'asc' : 'desc',
      },
      data: datasets,
    });
  } catch (error) {
    next(error);
  }
};

export const searchDatasets = async (req, res, next) => {
  try {
    const { q, query, category, limit = 20 } = req.query;
    const searchTerm = (q || query || '').trim();

    if (!searchTerm) {
      return res.status(200).json({
        success: true,
        count: 0,
        total: 0,
        query: '',
        data: [],
      });
    }

    const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const filter = {
      $or: [
        { name: regex },
        { description: regex },
        { source: regex },
        { category: regex },
        { geography: regex },
        { tags: { $in: [regex] } },
      ],
    };

    if (category && category !== 'All') {
      filter.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const datasets = await Dataset.find(filter).limit(limitNum);

    res.status(200).json({
      success: true,
      count: datasets.length,
      total: datasets.length,
      query: searchTerm,
      data: datasets,
    });
  } catch (error) {
    next(error);
  }
};

export const getDatasetById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid dataset ID format: '${id}'`,
      });
    }

    const dataset = await Dataset.findById(id);

    if (!dataset) {
      return res.status(404).json({
        success: false,
        error: `Dataset not found with ID '${id}'`,
      });
    }

    res.status(200).json({
      success: true,
      data: dataset,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categoryCounts = await Dataset.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          sources: { $addToSet: '$source' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const categories = categoryCounts.map((item) => ({
      name: item._id,
      count: item.count,
      sourcesCount: item.sources.length,
    }));

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const totalDatasets = await Dataset.countDocuments();
    const categories = await Dataset.distinct('category');
    const geographies = await Dataset.distinct('geography');
    const years = await Dataset.distinct('year');
    const sources = await Dataset.distinct('source');

    const totalRecordsAgg = await Dataset.aggregate([
      { $group: { _id: null, totalObservedRecords: { $sum: '$recordsCount' } } },
    ]);

    const totalRecords = totalRecordsAgg[0]?.totalObservedRecords || 0;

    res.status(200).json({
      success: true,
      data: {
        totalDatasets,
        totalRecords,
        categoriesCount: categories.length,
        sourcesCount: sources.length,
        categories,
        geographies,
        years: years.sort((a, b) => b - a),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const summarizeDataset = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid dataset ID format: '${id}'`,
      });
    }

    const dataset = await Dataset.findById(id);

    if (!dataset) {
      return res.status(404).json({
        success: false,
        error: `Dataset not found with ID '${id}'`,
      });
    }

    const summary = generateDatasetSummary(dataset);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};
