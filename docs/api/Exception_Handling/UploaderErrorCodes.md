---
title: UploaderErrorCodes
description: Enumeration of machine-readable error codes for identifying specific failure conditions.
---

# UploaderErrorCodes

> `const` **UploaderErrorCodes**: `object`

Defined in: [packages/headless-uploader/src/constants/error-codes.ts:7](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/constants/error-codes.ts#L7)

Common uploader error codes

## Type Declaration

### ABORT\_ERROR

> `readonly` **ABORT\_ERROR**: `"ABORT_ERROR"` = `'ABORT_ERROR'`

The upload was intentionally stopped (paused/cancelled).

### BROWSER\_UNSUPPORTED

> `readonly` **BROWSER\_UNSUPPORTED**: `"BROWSER_UNSUPPORTED"` = `'BROWSER_UNSUPPORTED'`

The browser does not support a required API (e.g., WebTransport).

### CONFIG\_ERROR

> `readonly` **CONFIG\_ERROR**: `"CONFIG_ERROR"` = `'CONFIG_ERROR'`

A required configuration property is missing or invalid.

### CUSTOM\_VALIDATION\_ERROR

> `readonly` **CUSTOM\_VALIDATION\_ERROR**: `"CUSTOM_VALIDATION_ERROR"` = `'CUSTOM_VALIDATION_ERROR'`

A custom validator function returned an error or threw an exception.

### DUPLICATE\_FILE

> `readonly` **DUPLICATE\_FILE**: `"DUPLICATE_FILE"` = `'DUPLICATE_FILE'`

The file is already in the queue and `allowDuplicates` is false.

### FILE\_TOO\_LARGE

> `readonly` **FILE\_TOO\_LARGE**: `"FILE_TOO_LARGE"` = `'FILE_TOO_LARGE'`

The file exceeds the `maxFileSize` limit.

### FILE\_TOO\_SMALL

> `readonly` **FILE\_TOO\_SMALL**: `"FILE_TOO_SMALL"` = `'FILE_TOO_SMALL'`

The file is smaller than the `minFileSize` limit.

### FORMATTING\_ERROR

> `readonly` **FORMATTING\_ERROR**: `"FORMATTING_ERROR"` = `'FORMATTING_ERROR'`

An internal error occurred during data formatting.

### HTTP\_ERROR

> `readonly` **HTTP\_ERROR**: `"HTTP_ERROR"` = `'HTTP_ERROR'`

A standard HTTP request failed (non-2xx response).

### INVALID\_FILE\_TYPE

> `readonly` **INVALID\_FILE\_TYPE**: `"INVALID_FILE_TYPE"` = `'INVALID_FILE_TYPE'`

The file MIME type or extension is not in `acceptedTypes`.

### MAX\_FILES\_EXCEEDED

> `readonly` **MAX\_FILES\_EXCEEDED**: `"MAX_FILES_EXCEEDED"` = `'MAX_FILES_EXCEEDED'`

The total number of files exceeds `maxFiles`. (Legacy alias for TOO_MANY_FILES)

### NETWORK\_ERROR

> `readonly` **NETWORK\_ERROR**: `"NETWORK_ERROR"` = `'NETWORK_ERROR'`

A physical network failure or DNS resolution issue occurred.

### SERVER\_ERROR

> `readonly` **SERVER\_ERROR**: `"SERVER_ERROR"` = `'SERVER_ERROR'`

The server sent an invalid or malformed response.

### TIMEOUT\_ERROR

> `readonly` **TIMEOUT\_ERROR**: `"TIMEOUT_ERROR"` = `'TIMEOUT_ERROR'`

The request exceeded the configured `timeout`.

### TOO\_MANY\_FILES

> `readonly` **TOO\_MANY\_FILES**: `"TOO_MANY_FILES"` = `'TOO_MANY_FILES'`

The total number of files exceeds `maxFiles`.

### TUS\_ERROR

> `readonly` **TUS\_ERROR**: `"TUS_ERROR"` = `'TUS_ERROR'`

A protocol-level error occurred within the Tus client.

### UNKNOWN\_ERROR

> `readonly` **UNKNOWN\_ERROR**: `"UNKNOWN_ERROR"` = `'UNKNOWN_ERROR'`

An error occurred that does not fit into other categories.

### UPLOAD\_FAILED

> `readonly` **UPLOAD\_FAILED**: `"UPLOAD_FAILED"` = `'UPLOAD_FAILED'`

A generic catch-all for failed upload attempts.
