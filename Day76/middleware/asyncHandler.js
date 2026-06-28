// Wraps async controller functions to eliminate try/catch repetition
// Instead of: try { await ... } catch(err) { next(err) }
// Just do: asyncHandler(async (req, res, next) => { ... })

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
