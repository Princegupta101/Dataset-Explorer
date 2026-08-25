#!/usr/bin/env python3
"""
StatsUSA Dataset Processing, Normalization & Ingestion Script
-------------------------------------------------------------
This script demonstrates data pipeline processing:
1. Loads raw dataset definitions
2. Cleans strings, standardizes categorical values, and validates year/geography
3. Calculates dataset metadata & summary statistics
4. Exports normalized JSON and CSV files ready for database ingestion
"""

import os
import json
import csv
from typing import List, Dict, Any

RAW_DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'backend', 'src', 'data', 'sampleDatasets.json')
OUTPUT_CLEAN_JSON = os.path.join(os.path.dirname(__file__), 'cleaned_datasets.json')
OUTPUT_SUMMARY_CSV = os.path.join(os.path.dirname(__file__), 'datasets_summary.csv')

VALID_CATEGORIES = {'Demographics', 'Healthcare', 'Education', 'Housing', 'Economics'}
VALID_GEOGRAPHIES = {'National', 'State', 'County', 'Metro', 'City'}

def clean_record(record: Dict[str, Any], idx: int) -> Dict[str, Any]:
    """Clean, normalize, and validate an individual dataset record."""
    # 1. Clean and normalize string fields
    name = record.get('name', '').strip()
    if not name:
        raise ValueError(f"Record #{idx}: Dataset name is missing or empty")

    category = record.get('category', '').strip().title()
    if category not in VALID_CATEGORIES:
        print(f"[Warning] Record '{name}': Unknown category '{category}'. Defaulting to 'Demographics'")
        category = 'Demographics'

    description = record.get('description', '').strip()
    source = record.get('source', '').strip()

    geography = record.get('geography', 'National').strip().title()
    if geography not in VALID_GEOGRAPHIES:
        geography = 'National'

    try:
        year = int(record.get('year', 2023))
        if year < 1900 or year > 2100:
            year = 2023
    except (ValueError, TypeError):
        year = 2023

    tags = [str(t).strip() for t in record.get('tags', []) if str(t).strip()]
    records_count = int(record.get('recordsCount', 0))
    sample_attributes = [str(a).strip() for a in record.get('sampleAttributes', [])]
    update_frequency = record.get('updateFrequency', 'Annual').strip()
    access_type = record.get('accessType', 'Open Data').strip()

    return {
        'name': name,
        'category': category,
        'description': description,
        'source': source,
        'geography': geography,
        'year': year,
        'tags': tags,
        'recordsCount': records_count,
        'sampleAttributes': sample_attributes,
        'updateFrequency': update_frequency,
        'accessType': access_type,
    }

def process_pipeline():
    print("=" * 60)
    print("StatsUSA - Dataset ETL and Data Cleaning Pipeline")
    print("=" * 60)

    if not os.path.exists(RAW_DATA_PATH):
        print(f"[Error] Raw dataset file not found at: {RAW_DATA_PATH}")
        return

    with open(RAW_DATA_PATH, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)

    print(f"[*] Loaded {len(raw_data)} raw records from: {os.path.basename(RAW_DATA_PATH)}")

    cleaned_data: List[Dict[str, Any]] = []
    category_counts = {}
    geography_counts = {}
    total_records = 0

    for i, record in enumerate(raw_data, 1):
        cleaned = clean_record(record, i)
        cleaned_data.append(cleaned)

        # Aggregate stats
        cat = cleaned['category']
        category_counts[cat] = category_counts.get(cat, 0) + 1

        geo = cleaned['geography']
        geography_counts[geo] = geography_counts.get(geo, 0) + 1

        total_records += cleaned['recordsCount']

    # Export cleaned JSON
    with open(OUTPUT_CLEAN_JSON, 'w', encoding='utf-8') as f:
        json.dump(cleaned_data, f, indent=2)
    print(f"[OK] Cleaned JSON exported to: {OUTPUT_CLEAN_JSON}")

    # Export Summary CSV
    with open(OUTPUT_SUMMARY_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Dataset Name', 'Category', 'Geography', 'Year', 'Source', 'Records Count', 'Tags Count'])
        for item in cleaned_data:
            writer.writerow([
                item['name'],
                item['category'],
                item['geography'],
                item['year'],
                item['source'],
                item['recordsCount'],
                len(item['tags'])
            ])
    print(f"[OK] Summary CSV exported to: {OUTPUT_SUMMARY_CSV}")

    # Display summary report
    print("\n--- Pipeline Execution Summary ---")
    print(f"Total Datasets Processed: {len(cleaned_data)}")
    print(f"Total Observed Records: {total_records:,}")
    print("\nBreakdown by Category:")
    for cat, count in sorted(category_counts.items()):
        print(f"  - {cat:15}: {count} datasets")
    print("\nBreakdown by Geography:")
    for geo, count in sorted(geography_counts.items()):
        print(f"  - {geo:15}: {count} datasets")
    print("=" * 60)

if __name__ == '__main__':
    process_pipeline()
