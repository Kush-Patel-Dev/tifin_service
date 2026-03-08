/**
 * Extract and format a display name from an email address
 * @param {string} email - The email address to extract a name from.
 * @returns {string} A formatted display name, or "User" as fallback.
 */
export function getNameFromEmail(email) {
  // Validate email input
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return "User";
  }

  // Extract username part (before @)
  const username = email.split("@")[0];

  // Remove all numbers and add space after them
  const withoutNumbers = username.replace(/[0-9]+/g, " ");

  // Add space before uppercase letters (camelCase splitting)
  const camelSplit = withoutNumbers.replace(/([a-z])([A-Z])/g, "$1 $2");

  // Replace separators (dots, underscores, hyphens) with spaces and normalize
  const withSpaces = camelSplit
    .replace(/[._-]/g, " ")
    .replace(/\s+/g, " ") // Collapse multiple spaces into one
    .trim();

  // If nothing is left after cleanup, return fallback
  if (!withSpaces) {
    return "User";
  }

  // Capitalize first letter of each word
  const formatted = withSpaces
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return formatted || "User";
}
