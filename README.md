# StatsUSA — Dataset Explorer

A full-stack dataset explorer application for discovering, filtering, and analyzing public datasets across demographics, healthcare, education, housing, and economics.

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS v4, Vite
- **Backend**: Node.js, Express (ES Modules)
- **Database**: MongoDB with Mongoose
- **Testing**: Jest, Supertest

## Features

- **Search & Filters**: Search by keyword/name, filter by category, geography, or year.
- **Views**: Toggle between grid and table layouts.
- **Dataset Details**: Modal showing complete dataset metadata, schema fields, and citation copying.
- **Dataset Summaries**: Generates executive takeaways, domain focus, and sample research questions.
- **Pagination & Sorting**: Paginate results and sort by name or year.
- **ETL Script**: Python script (`scripts/process_datasets.py`) for data validation, cleaning, and export.
- **Docker Support**: Multi-container setup with `docker-compose.yml`.

## Project Structure

```
StatsUSA/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # MongoDB connection
│   │   ├── controllers/          # Request handlers
│   │   ├── data/                 # Sample datasets & seeder
│   │   ├── middleware/           # Error handling
│   │   ├── models/Dataset.js     # Mongoose schema
│   │   ├── routes/               # API routes
│   │   ├── utils/                # Dataset summarizer utility
│   │   ├── app.js                # Express app configuration
│   │   └── server.js             # Server entry point
│   ├── tests/                    # Integration tests
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/           # React components (TSX)
│   │   ├── services/api.ts       # API client
│   │   ├── types/dataset.ts      # TypeScript definitions
│   │   ├── App.tsx               # Main application
│   │   └── index.css             # Styles
│   ├── Dockerfile
│   └── package.json
├── scripts/
│   └── process_datasets.py       # Python data cleaning script
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB running locally on port 27017 (or via Docker)

### 1. Backend Setup

```bash
cd backend
npm install

# Seed the database with sample datasets
npm run seed

# Start the API server (runs on http://localhost:5000)
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install

# Start the Vite development server (runs on http://localhost:5173)
npm run dev
```

### Running with Docker

To run the full stack (MongoDB, API, Frontend) using Docker:

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server status |
| `GET` | `/datasets` | List datasets (supports `q`, `category`, `geography`, `year`, `sortBy`, `sortOrder`, `page`, `limit`) |
| `GET` | `/datasets/search?q=...` | Search datasets by keyword |
| `GET` | `/datasets/:id` | Get dataset by ID |
| `GET` | `/datasets/categories` | Get category list with counts |
| `GET` | `/datasets/stats` | Platform-level statistics |
| `POST` | `/datasets/:id/summarize` | Generate analytical summary for a dataset |

## Testing

Run the backend integration test suite:

```bash
cd backend
npm test
```

## Data Cleaning Script

To run the Python data processing pipeline:

```bash
python scripts/process_datasets.py
```

This validates records, standardizes fields, and exports:
- `scripts/cleaned_datasets.json`
- `scripts/datasets_summary.csv`

## Assumptions

- Categories are standardized to Demographics, Healthcare, Education, Housing, and Economics.
- MongoDB connects to `mongodb://127.0.0.1:27017/statsusa` by default.
- Datasets follow federal open data reporting standards with attributes and record counts.
