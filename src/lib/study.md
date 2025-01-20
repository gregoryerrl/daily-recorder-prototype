# Library Directory Study

## Overview

The `lib` directory contains core utilities and server-side functionality for the Daily Recorder application, primarily focusing on database operations and schema definitions.

## Database Module (`server/database.js`)

### Configuration

```javascript
import {createClient} from "@libsql/client";
import {TURSO_DB_URL, TURSO_DB_AUTH_TOKEN} from "$env/static/private";
```

- Uses Turso (LibSQL) as the database provider
- Requires environment variables for connection:
  - `TURSO_DB_URL`: Database URL
  - `TURSO_DB_AUTH_TOKEN`: Authentication token

### Error Handling

```javascript
const DB_ERROR_CODES = {
  INVALID_INPUT: "INVALID_INPUT",
  NOT_FOUND: "NOT_FOUND",
  CONSTRAINT_VIOLATION: "CONSTRAINT_VIOLATION",
  DATABASE_ERROR: "DATABASE_ERROR",
};
```

- Standardized error codes for database operations
- Consistent error handling across all functions

### Validation Functions

#### `validateId(id)`

- Validates ID strings
- Ensures non-empty trimmed values

#### `validateDate(date)`

- Validates date format (YYYY-MM-DD)
- Uses regex pattern matching

#### `validateCollector({name, description, maxOccurrencesPerDay})`

- Validates collector creation data
- Checks name requirement
- Validates max occurrences value

#### `validateField({label, type, required})`

- Validates field creation data
- Checks label requirement
- Validates field type against allowed types
- Validates required flag

### Database Operations

#### Collectors

1. `getCollectors()`: Retrieves all collectors
2. `getCollector(id)`: Gets specific collector by ID
3. `createCollector(data)`: Creates new collector
4. `deleteCollector(id)`: Deletes collector and related data

#### Fields

1. `getFields(collectorId)`: Gets fields for a collector
2. `createField(data)`: Creates new field for collector

#### Entries

1. `getEntries(collectorId, date)`: Gets entries for collector on date
2. `createEntry({collectorId, date, values})`: Creates new entry

## Database Schema (`server/schema.sql`)

### Tables

#### Collectors

```sql
CREATE TABLE collectors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    max_occurrences_per_day INTEGER NOT NULL DEFAULT -1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at TEXT DEFAULT NULL
);
```

- Stores collector configurations
- Supports soft deletion
- Tracks creation/update times

#### Fields

```sql
CREATE TABLE fields (
    id TEXT PRIMARY KEY,
    collector_id TEXT NOT NULL,
    label TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('text', 'number', 'checkbox', 'textarea')),
    required INTEGER NOT NULL DEFAULT 1,
    settings TEXT NOT NULL DEFAULT '{}',
    -- timestamps
    FOREIGN KEY (collector_id) REFERENCES collectors(id)
);
```

- Defines collector fields
- Supports multiple field types
- JSON settings for extensibility
- Cascading deletion with collector

#### Entries

```sql
CREATE TABLE entries (
    id TEXT PRIMARY KEY,
    collector_id TEXT NOT NULL,
    entry_date TEXT NOT NULL,
    -- timestamps
    FOREIGN KEY (collector_id) REFERENCES collectors(id)
);
```

- Stores collector entries
- Links to collector
- Includes entry date

#### Entry Values

```sql
CREATE TABLE entry_values (
    id TEXT PRIMARY KEY,
    entry_id TEXT NOT NULL,
    field_id TEXT NOT NULL,
    value_text TEXT,
    -- timestamps
    FOREIGN KEY (entry_id) REFERENCES entries(id),
    FOREIGN KEY (field_id) REFERENCES fields(id)
);
```

- Stores field values for entries
- Links to both entry and field
- Flexible value storage as text

### Indexes

- `idx_collectors_deleted_at`: Optimizes soft delete queries
- `idx_fields_collector_id`: Speeds up field lookups by collector
- `idx_entries_collector_date`: Optimizes entry queries by date
- `idx_entry_values_entry_id`: Improves value lookups by entry
- `idx_entry_values_field_id`: Enhances value lookups by field

### Future Features

- Files table for attachment support
- Soft deletion support across all tables
- Timestamp tracking for all records

## Key Features

### Data Integrity

1. Foreign key constraints
2. Field type validation
3. Required field enforcement
4. JSON validation for settings

### Performance

1. Strategic indexing
2. Efficient query patterns
3. Prepared statements

### Maintainability

1. Consistent error handling
2. Input validation
3. Soft deletion support
4. Timestamp tracking

## Dependencies

- `@libsql/client`: Turso database client
- `$env/static/private`: Environment variable handling
- `@sveltejs/kit`: Error handling utilities
