export const STATUS_CODE: Record<string, number> = {
  SUCCESS: 200, // GET / Fetch success
  CREATED: 201, // POST / Resource created
  UPDATED: 200, // PUT / PATCH success
  DELETED: 200, // DELETE success
  BAD_REQUEST: 400, // Invalid input or missing fields
  UNAUTHORIZED: 401, // No or invalid token
  FORBIDDEN: 403, // Not allowed to perform this action
  NOT_FOUND: 404, // Resource not found
  CONFLICT: 409, // Duplicate resource (e.g., existing code or name)
  UNPROCESSABLE: 422, // Validation or logical error
  SERVER_ERROR: 500, // Internal server error
};
