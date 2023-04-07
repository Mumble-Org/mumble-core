/**
 * Extract error message from error object
 */
export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

	return String(error);
}
