-- Table: collectors
CREATE TABLE collectors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    max_occurrences_per_day INTEGER NOT NULL DEFAULT -1 CHECK (max_occurrences_per_day = -1 OR max_occurrences_per_day > 0),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at TEXT DEFAULT NULL
);

-- Table: fields
CREATE TABLE fields (
    id TEXT PRIMARY KEY,
    collector_id TEXT NOT NULL,
    label TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('text', 'number', 'checkbox', 'textarea')),
    required INTEGER NOT NULL DEFAULT 1 CHECK (required IN (0,1)),
    settings TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(settings)),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at TEXT DEFAULT NULL
);

-- Table: entries
CREATE TABLE entries (
    id TEXT PRIMARY KEY,
    collector_id TEXT NOT NULL,
    entry_date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at TEXT DEFAULT NULL
);

-- Table: entry_values
CREATE TABLE entry_values (
    id TEXT PRIMARY KEY,
    entry_id TEXT NOT NULL,
    field_id TEXT NOT NULL,
    value_text TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at TEXT DEFAULT NULL
);

-- Table: files (for future use)
CREATE TABLE files (
    id TEXT PRIMARY KEY,
    entry_value_id TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    original_filename TEXT,
    mime_type TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at TEXT DEFAULT NULL
); 