use ('e-commerce');

// Delete a single document from the 'contacts' collection where the name is 'Bob'
// db.contacts.deleteOne({ name: 'Bob' });

// Delete multiple documents from the 'orders' collection where the status is 'Delivered'
db.orders.deleteMany({ status: 'Delivered' });