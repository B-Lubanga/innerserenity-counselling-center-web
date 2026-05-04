#!/usr/bin/env python3
"""
Import database tables from JSON/CSV format for migration or restore.
Supports upsert (INSERT ... ON CONFLICT DO UPDATE) to preserve existing data.
"""

import json
import csv
import os
import sys
from pathlib import Path
from datetime import datetime
from decimal import Decimal

# Add parent directory to path to import from backend
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "backend"))

from sqlalchemy import create_engine, text, inspect
from sqlalchemy.orm import sessionmaker

# Database connection - update this to match your environment
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/innerserenity")

# Primary keys for each table (for upsert logic)
TABLE_PRIMARY_KEYS = {
    "staff": ["id"],
    "clients": ["id"],
    "service_types": ["id"],
    "availability": ["id"],
    "bookings": ["id"],
    "session_reports": ["id"],
    "invoice_templates": ["id"],
    "invoices": ["id"],
    "quotes": ["id"],
    "messages": ["id"],
}

# Unique constraints for upsert (alternative to primary key)
TABLE_UNIQUE_KEYS = {
    "staff": ["email"],
    "clients": ["email"],
    "service_types": ["name"],
    "invoices": ["invoice_number"],
}


def get_unique_key(table_name):
    """Get the unique key for upsert operations."""
    if table_name in TABLE_PRIMARY_KEYS:
        return TABLE_PRIMARY_KEYS[table_name]
    elif table_name in TABLE_UNIQUE_KEYS:
        return TABLE_UNIQUE_KEYS[table_name]
    else:
        # Default to 'id' if not specified
        return ["id"]


def format_value(value):
    """Format a value for SQL insertion."""
    if value is None:
        return "NULL"
    elif isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    elif isinstance(value, (int, float, Decimal)):
        return str(value)
    elif isinstance(value, str):
        # Check if it's a datetime string
        if value.endswith("Z") or "T" in value:
            try:
                dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
                return f"'{dt.isoformat()}'"
            except:
                pass
        # Escape single quotes
        escaped = value.replace("'", "''")
        return f"'{escaped}'"
    else:
        return f"'{str(value)}'"


def upsert_from_json(engine, input_dir, truncate=False):
    """Import tables from JSON files with upsert support."""
    input_path = Path(input_dir)
    
    if not input_path.exists():
        print(f"❌ Directory {input_dir} does not exist")
        return
    
    json_files = list(input_path.glob("*.json"))
    
    # Skip metadata.json
    json_files = [f for f in json_files if f.name != "metadata.json"]
    
    if not json_files:
        print(f"❌ No JSON files found in {input_dir}")
        return
    
    inspector = inspect(engine)
    
    for json_file in json_files:
        table_name = json_file.stem
        
        with open(json_file, "r") as f:
            data = json.load(f)
        
        if not data:
            print(f"⚠️  Skipping empty table: {table_name}")
            continue
        
        with engine.connect() as conn:
            # Check if table exists
            if table_name not in inspector.get_table_names():
                print(f"⚠️  Table {table_name} does not exist, skipping")
                continue
            
            columns = list(data[0].keys())
            unique_keys = get_unique_key(table_name)
            
            # Verify unique keys exist in columns
            valid_keys = [k for k in unique_keys if k in columns]
            if not valid_keys:
                print(f"⚠️  No valid unique keys found for {table_name}, using truncate+insert")
                truncate = True
            
            if truncate:
                # Truncate and insert (replace mode)
                conn.execute(text(f"TRUNCATE TABLE {table_name} CASCADE"))
                conn.commit()
                
                for row in data:
                    values = [format_value(row[col]) for col in columns]
                    query = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(values)})"
                    conn.execute(text(query))
                
                conn.commit()
                print(f"✅ Replaced {len(data)} rows in {table_name}")
            else:
                # Upsert mode
                inserted = 0
                updated = 0
                
                for row in data:
                    values = [format_value(row[col]) for col in columns]
                    
                    # Build ON CONFLICT clause
                    conflict_columns = ", ".join(valid_keys)
                    update_columns = [col for col in columns if col not in valid_keys]
                    update_set = ", ".join([f"{col} = EXCLUDED.{col}" for col in update_columns])
                    
                    if update_set:
                        query = f"""
                            INSERT INTO {table_name} ({', '.join(columns)}) 
                            VALUES ({', '.join(values)})
                            ON CONFLICT ({conflict_columns}) 
                            DO UPDATE SET {update_set}
                        """
                    else:
                        # If no columns to update, just do nothing on conflict
                        query = f"""
                            INSERT INTO {table_name} ({', '.join(columns)}) 
                            VALUES ({', '.join(values)})
                            ON CONFLICT ({conflict_columns}) 
                            DO NOTHING
                        """
                    
                    result = conn.execute(text(query))
                    if result.rowcount == 1:
                        inserted += 1
                    else:
                        updated += 1
                
                conn.commit()
                print(f"✅ Upserted into {table_name}: {inserted} inserted, {updated} updated")


def import_from_csv(engine, input_dir, truncate=False):
    """Import tables from CSV files with upsert support."""
    input_path = Path(input_dir)
    
    if not input_path.exists():
        print(f"❌ Directory {input_dir} does not exist")
        return
    
    csv_files = list(input_path.glob("*.csv"))
    
    if not csv_files:
        print(f"❌ No CSV files found in {input_dir}")
        return
    
    inspector = inspect(engine)
    
    for csv_file in csv_files:
        table_name = csv_file.stem
        
        with open(csv_file, "r") as f:
            reader = csv.reader(f)
            columns = next(reader)
            rows = list(reader)
        
        if not rows:
            print(f"⚠️  Skipping empty table: {table_name}")
            continue
        
        with engine.connect() as conn:
            # Check if table exists
            if table_name not in inspector.get_table_names():
                print(f"⚠️  Table {table_name} does not exist, skipping")
                continue
            
            unique_keys = get_unique_key(table_name)
            valid_keys = [k for k in unique_keys if k in columns]
            
            if truncate or not valid_keys:
                # Truncate and insert (replace mode)
                conn.execute(text(f"TRUNCATE TABLE {table_name} CASCADE"))
                conn.commit()
                
                for row in rows:
                    values = [format_value(val) for val in row]
                    query = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(values)})"
                    conn.execute(text(query))
                
                conn.commit()
                print(f"✅ Replaced {len(rows)} rows in {table_name}")
            else:
                # Upsert mode
                inserted = 0
                updated = 0
                
                for row in rows:
                    row_dict = dict(zip(columns, row))
                    values = [format_value(val) for val in row]
                    
                    conflict_columns = ", ".join(valid_keys)
                    update_columns = [col for col in columns if col not in valid_keys]
                    update_set = ", ".join([f"{col} = EXCLUDED.{col}" for col in update_columns])
                    
                    if update_set:
                        query = f"""
                            INSERT INTO {table_name} ({', '.join(columns)}) 
                            VALUES ({', '.join(values)})
                            ON CONFLICT ({conflict_columns}) 
                            DO UPDATE SET {update_set}
                        """
                    else:
                        query = f"""
                            INSERT INTO {table_name} ({', '.join(columns)}) 
                            VALUES ({', '.join(values)})
                            ON CONFLICT ({conflict_columns}) 
                            DO NOTHING
                        """
                    
                    result = conn.execute(text(query))
                    if result.rowcount == 1:
                        inserted += 1
                    else:
                        updated += 1
                
                conn.commit()
                print(f"✅ Upserted into {table_name}: {inserted} inserted, {updated} updated")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Import database from JSON or CSV with upsert support",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Upsert from latest export (preserves existing data)
  python import_db.py
  
  # Import from specific date directory
  python import_db.py --date 2026-04-30
  
  # Replace all data (truncate + insert)
  python import_db.py --truncate
  
  # Import from custom directory
  python import_db.py --dir /path/to/export/2026-04-30/json
        """
    )
    parser.add_argument("--format", choices=["json", "csv"], default="json", help="Import format (default: json)")
    parser.add_argument("--dir", help="Input directory (default: exports/YYYY-MM-DD/<format>)")
    parser.add_argument("--date", help="Export date to import from (YYYY-MM-DD format)")
    parser.add_argument("--truncate", action="store_true", help="Truncate tables before import (replace mode)")
    
    args = parser.parse_args()
    
    engine = create_engine(DATABASE_URL)
    
    # Determine input directory
    if args.dir:
        input_dir = args.dir
    elif args.date:
        input_dir = Path(__file__).parent.parent / "exports" / args.date / args.format
    else:
        # Use latest export directory
        exports_dir = Path(__file__).parent.parent / "exports"
        if exports_dir.exists():
            dates = sorted([d.name for d in exports_dir.iterdir() if d.is_dir()])
            if dates:
                latest_date = dates[-1]
                input_dir = exports_dir / latest_date / args.format
            else:
                print("❌ No export directories found")
                sys.exit(1)
        else:
            print("❌ Exports directory does not exist")
            sys.exit(1)
    
    input_dir = Path(input_dir)
    
    print(f"📁 Importing from: {input_dir}")
    print(f"🔄 Mode: {'Replace (truncate)' if args.truncate else 'Upsert (preserve existing)'}")
    print()
    
    if args.format == "json":
        print("Importing from JSON...")
        upsert_from_json(engine, input_dir, truncate=args.truncate)
    else:
        print("Importing from CSV...")
        import_from_csv(engine, input_dir, truncate=args.truncate)
    
    print("\n✅ Import complete!")

