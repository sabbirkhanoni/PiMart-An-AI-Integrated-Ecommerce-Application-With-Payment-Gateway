/**
 * Custom NoSQL Injection Protection Middleware
 * Recursively strips keys starting with '$' or containing '.' from request body, query, and params
 */
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const clean = {};
  for (const [key, val] of Object.entries(obj)) {
    // Prohibit keys starting with $ (MongoDB query operators)
    if (key.startsWith("$")) {
      continue;
    }
    // Prohibit dot-notated operator keys in input
    const sanitizedKey = key.replace(/\./g, "_");
    clean[sanitizedKey] = sanitizeObject(val);
  }
  return clean;
};

const mongoSanitize = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  next();
};

export default mongoSanitize;
