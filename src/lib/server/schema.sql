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

CREATE INDEX idx_collectors_deleted_at ON collectors(deleted_at);

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
    deleted_at TEXT DEFAULT NULL,
    FOREIGN KEY (collector_id) REFERENCES collectors(id) ON DELETE CASCADE
);

CREATE INDEX idx_fields_collector_id ON fields(collector_id);
CREATE INDEX idx_fields_deleted_at ON fields(deleted_at);

-- Table: entries
CREATE TABLE entries (
    id TEXT PRIMARY KEY,
    collector_id TEXT NOT NULL,
    entry_date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at TEXT DEFAULT NULL,
    FOREIGN KEY (collector_id) REFERENCES collectors(id) ON DELETE CASCADE
);

CREATE INDEX idx_entries_collector_date ON entries(collector_id, entry_date);
CREATE INDEX idx_entries_deleted_at ON entries(deleted_at);

-- Table: entry_values
CREATE TABLE entry_values (
    id TEXT PRIMARY KEY,
    entry_id TEXT NOT NULL,
    field_id TEXT NOT NULL,
    value_text TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at TEXT DEFAULT NULL,
    FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

CREATE INDEX idx_entry_values_entry_id ON entry_values(entry_id);
CREATE INDEX idx_entry_values_field_id ON entry_values(field_id);
CREATE INDEX idx_entry_values_deleted_at ON entry_values(deleted_at);

-- Table: files (for future use)
CREATE TABLE files (
    id TEXT PRIMARY KEY,
    entry_value_id TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    original_filename TEXT,
    mime_type TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at TEXT DEFAULT NULL,
    FOREIGN KEY (entry_value_id) REFERENCES entry_values(id) ON DELETE CASCADE
);

CREATE INDEX idx_files_entry_value_id ON files(entry_value_id);
CREATE INDEX idx_files_deleted_at ON files(deleted_at); 