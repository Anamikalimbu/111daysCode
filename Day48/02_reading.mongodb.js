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
db.products.find({ $and: [ { category: "Electronics" }, { ratings: { $gt: 4.5 } } ] })