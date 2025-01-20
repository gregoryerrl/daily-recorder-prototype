# API Routes Study

## Overview

The API routes provide the backend functionality for the Daily Recorder application, handling data operations for collectors and entries.

## Collectors API (`/api/collectors/+server.js`)

### Endpoints

#### GET `/api/collectors`

Retrieves all collectors.

```javascript
export async function GET() {
  try {
    const collectors = await getCollectors();
    if (!collectors) {
      throw error(404, {message: "No collectors found"});
    }
    return json(collectors);
  } catch (err) {
    // Error handling
  }
}
```

- Fetches all collectors from database
- Returns 404 if no collectors found
- Includes error handling with status codes

#### POST `/api/collectors`

Creates a new collector.

```javascript
export async function POST({request}) {
  try {
    const {name, description, maxOccurrencesPerDay} = data;

    // Validation
    if (!name?.trim()) {
      throw error(400, {...});
    }

    if (maxOccurrencesPerDay !== undefined &&
        maxOccurrencesPerDay !== -1 &&
        maxOccurrencesPerDay < 1) {
      throw error(400, {...});
    }

    const id = await createCollector({...});
    return json({id, message: "Collector created successfully"});
  } catch (err) {
    // Error handling
  }
}
```

- Validates required fields
- Validates max occurrences value
- Creates collector in database
- Returns new collector ID

## Entries API (`/api/entries/+server.js`)

### Endpoints

#### GET `/api/entries`

Retrieves entries for a specific collector and date.

```javascript
export async function GET({url}) {
  try {
    const collectorId = url.searchParams.get("collectorId");
    const date = url.searchParams.get("date");

    // Parameter validation
    if (!collectorId?.trim()) {
      throw error(400, {...});
    }
    if (!date?.trim()) {
      throw error(400, {...});
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw error(400, {...});
    }

    // Collector validation
    const collector = await getCollector(collectorId);
    if (!collector) {
      throw error(404, {...});
    }

    const entries = await getEntries(collectorId, date);
    return json(entries);
  } catch (err) {
    // Error handling
  }
}
```

- Validates query parameters
- Validates date format
- Checks collector existence
- Returns entries for specified date

#### POST `/api/entries`

Creates a new entry for a collector.

```javascript
export async function POST({request}) {
  try {
    const {collectorId, date, values} = data;

    // Validation checks
    // ... parameter validation ...
    // ... date format validation ...

    // Get collector and fields
    const [collector, fields] = await Promise.all([
      getCollector(collectorId),
      getFields(collectorId),
    ]);

    // Check max occurrences
    if (collector.max_occurrences_per_day !== -1) {
      const existingEntries = await getEntries(collectorId, date);
      if (existingEntries.length >= collector.max_occurrences_per_day) {
        throw error(400, {...});
      }
    }

    // Validate field values
    const validatedValues = values.map(({fieldId, value}) => {
      // ... field validation ...
      // ... value type conversion ...
    });

    const id = await createEntry({...});
    return json({id, message: "Entry created successfully"});
  } catch (err) {
    // Error handling
  }
}
```

- Validates request data
- Checks collector existence
- Validates against max occurrences limit
- Processes and validates field values
- Creates entry in database

## Key Features

### Error Handling

- Consistent error response format
- HTTP status codes for different scenarios
- Error codes for client-side handling
- Detailed error messages

### Data Validation

- Required field validation
- Data type validation
- Format validation (dates)
- Business rule validation (max occurrences)

### Type Safety

- TypeScript type annotations
- Request/Response type checking
- Database operation type safety

## Dependencies

- SvelteKit for API routing
- Database utilities from `$lib/server/database.js`
- Built-in JSON and error utilities
