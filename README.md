# Daily Recorder App

## Purpose
The Daily Recorder App is a versatile journaling tool designed to help users document custom data entries on a daily basis. It offers a highly customizable and intuitive interface, making it suitable for personal, business, or specialized record-keeping needs.

---

### **Main Features**
- **Custom Data Recording**:
  - Users can create groups (collectors) to define their own set of fields.
  - Groups can include fields of various types such as text, numbers, monetary values, checkboxes, photos, and more.
- **Calendar Interface**:
  - Displays a monthly calendar to log data entries.
  - Highlights days with existing entries for easy navigation.
- **Field Validation**:
  - Required fields ensure users provide essential information before saving entries.

### **Entry Management**
- Add, edit, and delete entries for any day.
- Fields are customized per group, ensuring only valid data types are input.

### **Navigation**
- Switch between months to view or edit past entries.

### **Future Enhancements (v1.5) - To be discussed again after the first version**
- Add support for **basic reporting** on data entries.
- Implement field-level validations (e.g., numeric ranges, monetary limits).

---

## Developer Guide

### **Project Structure**
Ensure the project is organized to support customization and scalability:
- **Techstack**:
  - Fullstack Framework: **SvelteKit**
  - Database: **TursoDB**
  - Authentication: **Clerk-Sveltekit**
  - CSS Library: **TailwindCSS**
  - UI/Component Library: **Flowbite-Svelte**

### **Development Tasks**

#### **Frontend Tasks**
1. **Account Creation**:
   - Implement user registration and login functionality.
2. **Calendar View**:
   - Display the current month and highlight days with entries.
   - Enable navigation between months.
3. **Custom Group Input**:
   - Design and implement group-based input fields.
   - Enforce required fields and field validation.
4. **Entry Management**:
   - Add edit and delete functionality for individual entries.
5. **Responsive Design**:
   - Optimize the interface for mobile screens.
6. **Group Configuration**:
   - Build an interface for users to create and edit groups.

#### **Backend Tasks**
1. **User Authentication**:
   - Implement secure login and registration functionality.
2. **Data Management**:
   - Design APIs to handle CRUD operations for entries and groups.
3. **Field Validation**:
   - Implement logic to validate field types and required inputs.
4. **Reporting Features**:
   - Develop backend support for data summaries and filtered views (v1.5).

### **Database Structure**
- Follow the provided database schema for tables like `collectors`, `fields`, `entries`, and `entry_values`. You can check the database schema at the bottom of this README.md
- Ensure robust relationships between tables to support dynamic data entry and retrieval.

---

### **Running the App**
- Start the development server:
  ```bash
  npm run dev
  ```
- Access the app at `http://localhost:5173`.

---

## Contact
For questions or contributions, please reach out via our discord daily-recorder channel.




---
---
---
Here is the database schema we will be using to implement the Daily Recorder app.

```sql
-- Table: users
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Table: collectors (or groups)
CREATE TABLE collectors (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    max_occurrences_per_day INTEGER NOT NULL DEFAULT -1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table: fields
CREATE TABLE fields (
    id TEXT PRIMARY KEY,
    collector_id TEXT NOT NULL,
    label TEXT NOT NULL,
    type TEXT NOT NULL,
    required INTEGER NOT NULL DEFAULT 1 CHECK (required IN (0,1)),
    settings TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (collector_id) REFERENCES collectors(id)
);

-- Table: entries
CREATE TABLE entries (
    id TEXT PRIMARY KEY,
    collector_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (collector_id) REFERENCES collectors(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table: entry_values
CREATE TABLE entry_values (
    id TEXT PRIMARY KEY,
    entry_id TEXT NOT NULL,
    field_id TEXT NOT NULL,
    value_text TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (entry_id) REFERENCES entries(id),
    FOREIGN KEY (field_id) REFERENCES fields(id)
);

-- Table: files
CREATE TABLE files (
    id TEXT PRIMARY KEY,
    entry_value_id TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    original_filename TEXT,
    mime_type TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (entry_value_id) REFERENCES entry_values(id)
);
