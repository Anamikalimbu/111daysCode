use ('e-commerce');

db.products.updateOne(
    { name: 'Wireless Mouse' },
    { $set: { price: 500 } }
);