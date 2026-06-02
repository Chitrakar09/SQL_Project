export const StatusCode = {
  SUCCESS: 200, //Generic success, e.g., retrieving data successfully.
  CREATED: 201, //When a new resource is created successfully.
  NO_CONTENT: 204, //When deletion is successful and no content is returned.
  BAD_REQUEST: 400, // Validation errors, missing or invalid request fields.
  UNAUTHORIZED: 401, // Authentication required or invalid token.
  FORBIDDEN: 403, //User is authenticated but not allowed to perform the action.
  NOT_FOUND: 404, //Resource not found
  CONFLICT: 409, //Duplicate data or conflicting resource.
  UNPROCESSABLE_ENTITY: 422, //Semantic validation errors (e.g., invalid email format).
  INTERNAL_SERVER_ERROR: 500, //Database errors, server exceptions.
  SERVICE_UNAVAILABLE: 503, //Temporary server downtime, maintenance.
};