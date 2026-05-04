#!/usr/bin/env python3
"""
Export database tables to JSON/CSV format for backup or migration.
Exports to timestamped directories: database/exports/YYYY-MM-DD/
"""

import json
import csv
import os
import sys
from pathlib import Path
from datetime import datetime

# Add parent directory to path to import from backend
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "backend"))

from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker

# Database connection - update this to match your environment
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/innerserenity")


def get_timestamped_dir(base_dir="exports"):
    """Create and return a timestamped directory path."""
    timestamp = datetime.now().strftime("%Y-%m-%d")
    output_path = Path(__file__).parent.parent / base_dir / timestamp
    output_path.mkdir(parents=True, exist_ok=True)
    return output_path


def export_to_json(engine, output_dir):
    """Export all tables to JSON files"""
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    json_dir = output_dir / "json"
    json_dir.mkdir(exist_ok=True)
    
    for table_name in tables:
        with engine.connect() as conn:
            result = conn.execute(f"SELECT * FROM {table_name}")
            columns = result.keys()
            rows = [dict(zip(columns, row)) for row in result.fetchall()]
            
            # Convert to JSON-serializable format
            json_data = []
            for row in rows:
                json_row = {}
                for key, value in row.items():
                    if value is None:
                        json_row[key] = None
                    elif hasattr(value, 'isoformat'):  # datetime/date objects
                        json_row[key] = value.isoformat()
                    else:
                        json_row[key] = str(value)
                json_data.append(json_row)
            
            with open(json_dir / f"{table_name}.json", "w") as f:
                json.dump(json_data, f, indent=2, default=str)
            
            print(f"Exported {table_name} to {json_dir / table_name}.json ({len(json_data)} rows)")


def export_to_csv(engine, output_dir):
    """Export all tables to CSV files"""
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    csv_dir = output_dir / "csv"
    csv_dir.mkdir(exist_ok=True)
    
    for table_name in tables:
        with engine.connect() as conn:
            result = conn.execute(f"SELECT * FROM {table_name}")
            columns = result.keys()
            rows = result.fetchall()
            
            with open(csv_dir / f"{table_name}.csv", "w", newline="") as f:
                writer = csv.writer(f)
                writer.writerow(columns)
                writer.writerows(rows)
            
            print(f"Exported {table_name} to {csv_dir / table_name}.csv ({len(rows)} rows)")


def export_metadata(engine, output_dir):
    """Export database metadata (schema info)"""
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    metadata = {
        "exported_at": datetime.now().isoformat(),
        "database_url": str(engine.url).replace(":" + engine.url.password, ":****") if engine.url.password else str(engine.url),
        "tables": []
    }
    
    for table_name in tables:
        columns = inspector.get_columns(table_name)
        table_info = {
            "name": table_name,
            "columns": [
                {
                    "name": col["name"],
                    "type": str(col["type"]),
                    "nullable": col["nullable"],
                    "default": str(col["default"]) if col["default"] else None
                }
                for col in columns
            ]
        }
        metadata["tables"].append(table_info)
    
    with open(output_dir / "metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)
    
    print(f"Exported metadata to {output_dir / 'metadata.json'}")


if __name__ == "__main__":
    engine = create_engine(DATABASE_URL)
    
    # Create timestamped export directory
    output_dir = get_timestamped_dir()
    print(f"Exporting to: {output_dir}")
    print()
    
    print("Exporting database to JSON...")
    export_to_json(engine, output_dir)
    
    print("\nExporting database to CSV...")
    export_to_csv(engine, output_dir)
    
    print("\nExporting metadata...")
    export_metadata(engine, output_dir)
    
    print(f"\n✅ Export complete! Data saved to: {output_dir}")

