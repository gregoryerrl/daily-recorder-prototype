# Daily Recorder API Documentation

## Base URL

All API endpoints are relative to your server's base URL.

## Collectors

### List Collectors

```http
GET /api/collectors
```

**Response**

```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "maxOccurrencesPerDay": number
  }
]
```

### Create Collector

```http
POST /api/collectors
```

**Request Body**

```json
{
  "name": "string",
  "description": "string",
  "maxOccurrencesPerDay": number
}
```

**Response**

```json
{
  "id": "string",
  "message": "Collector created successfully"
}
```

### Delete Collector

```http
DELETE /api/collectors/{id}
```

**Response**

- Status: 200 OK

### Get Collector Fields

```http
GET /api/collectors/{id}/fields
```

**Response**

```json
[
  {
    "id": "string",
    "label": "string",
    "type": "text|number|textarea|checkbox",
    "required": boolean
  }
]
```

### Create Collector Field

```http
POST /api/collectors/{id}/fields
```

**Request Body**

```json
{
  "label": "string",
  "type": "text|number|textarea|checkbox",
  "required": boolean
}
```

**Response**

```json
{
  "id": "string",
  "message": "Field created successfully"
}
```

## Entries

### List Entries

```http
GET /api/entries?collectorId={collectorId}&date={YYYY-MM-DD}
```

**Query Parameters**

- `collectorId`: ID of the collector
- `date`: Date in YYYY-MM-DD format

**Response**

```json
[
  {
    "id": "string",
    "collectorId": "string",
    "date": "YYYY-MM-DD",
    "created_at": "string",
    "values": [
      {
        "fieldId": "string",
        "value_text": "string"
      }
    ]
  }
]
```

### Create Entry

```http
POST /api/entries
```

**Request Body**

```json
{
  "collectorId": "string",
  "date": "YYYY-MM-DD",
  "values": [
    {
      "fieldId": "string",
      "value": "string"
    }
  ]
}
```

**Response**

```json
{
  "id": "string",
  "message": "Entry created successfully"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

Common error codes:

- `INVALID_NAME`: Collector name is empty
- `INVALID_MAX_OCCURRENCES`: Invalid max occurrences value
- `INVALID_COLLECTOR_ID`: Missing or invalid collector ID
- `INVALID_DATE`: Missing or invalid date
- `INVALID_DATE_FORMAT`: Date not in YYYY-MM-DD format
- `MAX_ENTRIES_REACHED`: Maximum entries per day reached
- `INVALID_FIELD_ID`: Invalid field ID
- `INVALID_NUMBER_VALUE`: Invalid number value for field

### 404 Not Found

```json
{
  "message": "Resource not found message",
  "code": "NOT_FOUND_CODE"
}
```

Common error codes:

- `COLLECTOR_NOT_FOUND`: Collector not found

### 500 Internal Server Error

```json
{
  "message": "Internal server error message",
  "code": "SERVER_ERROR_CODE"
}
```

## Usage Examples

### Creating a Collector with Fields

1. Create a collector:

```javascript
const collectorResponse = await fetch("/api/collectors", {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({
    name: "Daily Exercise",
    description: "Track daily exercise routine",
    maxOccurrencesPerDay: 1,
  }),
});
const {id: collectorId} = await collectorResponse.json();
```

2. Add fields to the collector:

```javascript
const fieldResponse = await fetch(`/api/collectors/${collectorId}/fields`, {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({
    label: "Minutes Exercised",
    type: "number",
    required: true,
  }),
});
```

### Creating an Entry

```javascript
const entryResponse = await fetch("/api/entries", {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({
    collectorId: "collector-id",
    date: "2024-01-20",
    values: [
      {
        fieldId: "field-id",
        value: "30",
      },
    ],
  }),
});
```

### Fetching Entries for a Date

```javascript
const entries = await fetch(
  `/api/entries?collectorId=collector-id&date=2024-01-20`
).then((res) => res.json());
```
