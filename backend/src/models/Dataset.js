import mongoose from 'mongoose';

const DatasetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Dataset name is required'],
      trim: true,
      maxlength: [200, 'Dataset name cannot exceed 200 characters'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Demographics', 'Healthcare', 'Education', 'Housing', 'Economics'],
        message: '{VALUE} is not a valid category',
      },
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    source: {
      type: String,
      required: [true, 'Data source is required'],
      trim: true,
      maxlength: [150, 'Source name cannot exceed 150 characters'],
      index: true,
    },
    geography: {
      type: String,
      required: [true, 'Geography level is required'],
      trim: true,
      default: 'National',
      index: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1900, 'Year must be after 1900'],
      max: [2100, 'Year must be before 2100'],
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    recordsCount: {
      type: Number,
      default: 0,
    },
    sampleAttributes: {
      type: [String],
      default: [],
    },
    updateFrequency: {
      type: String,
      default: 'Annual',
    },
    accessType: {
      type: String,
      enum: ['Public', 'Restricted', 'Open Data'],
      default: 'Open Data',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound text index for full-text search across multiple fields
DatasetSchema.index({
  name: 'text',
  description: 'text',
  source: 'text',
  category: 'text',
  geography: 'text',
  tags: 'text',
});

// Index for multi-field filtering & sorting
DatasetSchema.index({ category: 1, year: -1 });
DatasetSchema.index({ name: 1, year: -1 });

export const Dataset = mongoose.model('Dataset', DatasetSchema);
export default Dataset;
