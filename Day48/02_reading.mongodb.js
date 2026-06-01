use ('e-commerce');

// Find Products
// db.products.find()

// find products with name "Wireless Mouse"
// db.products.find({ name: "Wireless Mouse" })

// find products by category "Electronics"
// db.products.find({ category: "Electronics" })


// Comparison Operators

// find products with price greater than 1000
// db.products.find({ price: { $gt: 1000 } })

// find products with price less than or equal to 1000
// db.products.find({ price: { $lte: 1000 } })

// find products with price between 500 and 3000
// db.products.find({ price: { $gte: 500, $lte: 3000 } })

// Logical Operators

// find products that are in "Electronics" category and have ratings greater than 4.5
//db.products.find({ $and: [ { category: "Electronics" }, { ratings: { $gt: 4.5 } } ] })

// find products that are either in "Electronics" category or have stock less than 50
// db.products.find({$or: [ { category: "Electronics" }, { stock: { $lt: 50 } } ] })

// find products of specific fields
// db.products.find({}, { name: 1, price: 1, _id: 0 })

// find products with sorting
// db.products.find().sort({ price: -1 }) // Sort by price in descending order

// find products with Sorting and Limit
 db.products.find().sort({ price: -1 }).limit(5) // Sort by price in descending order and limit to 5 products