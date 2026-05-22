const printHeader = (title) => {
    console.log(`\n=========================================`);
    console.log(` ${title.toUpperCase()}`);
    console.log(`=========================================`);
};

printHeader("2. Array Methods (map, filter, reduce)");

const products = [
    { id: 1, name: "Mechanical Keyboard", price: 120, category: "Electronics", inStock: true },
    { id: 2, name: "Wireless Mouse", price: 50, category: "Electronics", inStock: false },
    { id: 3, name: "Ergonomic Chair", price: 350, category: "Furniture", inStock: true },
    { id: 4, name: "LED Monitor", price: 250, category: "Electronics", inStock: true },
    { id: 5, name: "Water Bottle", price: 25, category: "Accessories", inStock: true },
    { id: 6, name: "Desk Mat", price: 30, category: "Accessories", inStock: false }
];

console.log("Original Products List:\n", products.map(p => ` - ${p.name} ($${p.price})`).join("\n"));

// Map: Transform the array (e.g., get a list of product names, or apply a discount)
console.log("\n A. map(): Applying 10% discount on all items:");
const discountedProducts = products.map(product => ({
    ...product,
    price: product.price * 0.9 // 10% off
}));
console.log(discountedProducts.map(p => ` - ${p.name}: New Price = $${p.price.toFixed(2)}`).join("\n"));

// Filter: Filter items matching a condition (e.g., electronics in stock)
console.log("\n B. filter(): Filtering items that are in stock and Electronics:");
const availableElectronics = products.filter(product => product.category === "Electronics" && product.inStock);
console.log(availableElectronics.map(p => ` - ${p.name} ($${p.price})`).join("\n"));

// Reduce: Accumulate values (e.g., total cost of all in-stock products)
console.log("\n C. reduce(): Calculating total value of in-stock items:");
const totalInStockValue = products
    .filter(product => product.inStock)
    .reduce((accumulator, product) => {
        return accumulator + product.price;
    }, 0); // 0 is the initial value of accumulator
console.log(`Total Value of In-Stock items: $${totalInStockValue}`);

// Advanced Reduce: Group products by category
console.log("\nAdvanced reduce(): Grouping items by category:");
const groupedByCategory = products.reduce((acc, product) => {
    const cat = product.category;
    if (!acc[cat]) {
        acc[cat] = [];
    }
    acc[cat].push(product.name);
    return acc;
}, {});
console.log(groupedByCategory);
