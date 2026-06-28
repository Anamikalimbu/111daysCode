// ============================================================
// APIFeatures — chains Search, Filter, Sort, Paginate
// Usage: new APIFeatures(Model.find(), req.query)
//          .search()
//          .filter()
//          .sort()
//          .paginate()
// ============================================================

class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;       // Mongoose query object
    this.queryStr = queryStr; // req.query from Express
  }

  // 🔍 SEARCH — keyword match on name & description
  search() {
    const keyword = this.queryStr.search
      ? {
          $or: [
            { name: { $regex: this.queryStr.search, $options: "i" } },
            { description: { $regex: this.queryStr.search, $options: "i" } },
          ],
        }
      : {};

    this.query = this.query.find(keyword);
    return this; // return this so we can chain
  }

  // 🎯 FILTER — by category, min/max price, etc.
  filter() {
    const queryObj = { ...this.queryStr };

    // Remove fields that are NOT filters
    const excludedFields = ["search", "sort", "page", "limit", "fields"];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Convert operators: gt → $gt, gte → $gte, lt → $lt, lte → $lte
    // e.g. ?price[gte]=500 → { price: { $gte: 500 } }
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // 🔃 SORT — by field, ascending or descending
  sort() {
    if (this.queryStr.sort) {
      // ?sort=price → sort by price asc
      // ?sort=-price → sort by price desc
      // ?sort=price,-createdAt → multi-sort
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // Default: newest first
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  // 📄 PAGINATE — skip & limit
  paginate() {
    const page = parseInt(this.queryStr.page) || 1;
    const limit = parseInt(this.queryStr.limit) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;
    return this;
  }

  // 📌 FIELD SELECTION — only return specific fields
  selectFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v"); // exclude __v by default
    }
    return this;
  }
}

module.exports = APIFeatures;
