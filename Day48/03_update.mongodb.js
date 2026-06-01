use ('e-commerce');

// Update Product Price
// db.products.updateOne(
//     { name: 'Wireless Mouse' },
//     { $set: { price: 999 } }
// );

// Update Multiple Products
// db.products.updateMany(
//     { category: 'Electronics' },
//     { $inc: { stock: 100 } }
// );

// add array of tags to a product
db.products.updateOne(
    { name: 'Wireless Mouse' },
    { $push: { tags: 'mouse' } }
);