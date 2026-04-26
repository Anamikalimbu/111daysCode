# Node with Express API

## Node.Js
- Node.js is an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside of a web browser. It allows developers to build server-side applications using JavaScript, which was traditionally used only for client-side scripting in web browsers.
- Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows developers to run JavaScript on the server side, enabling the creation of scalable and high-performance applications.
- Node.js uses an event-driven, non-blocking I/O model, making it efficient and suitable for real-time applications.
- Node.js has a vast ecosystem of libraries and frameworks, such as Express.js, which simplifies the development of web applications and APIs.
- Built on C++
- Powered by Google Chrome v8 engine
- Asynchronous and Event Driven
- Single Threaded but Highly Scalable
- Fast and Lightweight
- used to build: API, real time apps, micro-services

## Architecture
- built on a single-threaded event loop architecture, which allows it to handle multiple concurrent connections efficiently without blocking the execution of code. This design makes Node.js particularly well-suited for building scalable and high-performance applications, especially those that require real-time interactions or handle a large number of simultaneous requests.
- single-threaded 
- Event loop
- non-blocking I/O operations
- Node.js uses an event-driven, non-blocking I/O model, which allows it to handle multiple concurrent connections efficiently without blocking the execution of code. This design makes Node.js particularly well-suited for building scalable and high-performance applications, especially those that require real-time interactions or handle a large number of simultaneous requests.


## Core Modules

- File System (fs): Provides an API for interacting with the file system, allowing you to read, write, and manipulate files and directories.

- Type of File System Models:
  - Synchronous: Blocking operations that halt the execution of code until the operation is complete. Example: fs.readFileSync(), fs.writeFileSync().
  - Asynchronous: Non-blocking operations that allow the execution of code to continue while the operation is being performed. Example: fs.readFile(), fs.writeFile().
  
- Type of file system operations:
  - fs.readFile() - Reads the contents of a file asynchronously.
  - fs.writeFile() - Writes data to a file asynchronously.
  - fs.appendFile() - Appends data to a file asynchronously.
  - fs.unlink() - Deletes a file asynchronously.
  - fs.mkdir() - Creates a new directory asynchronously.
  - fs.readdir() - Reads the contents of a directory asynchronously.

  # HTTP module:
- The HTTP module in Node.js allows you to create web servers and handle HTTP requests and responses. It provides a simple and efficient way to build web applications and APIs.
- The HTTP module provides methods for creating a server, handling incoming requests, and sending responses back to the client. It also supports features like routing, middleware, and handling different HTTP methods (GET, POST, PUT, DELETE, etc.).
- Example of creating a simple HTTP server using the HTTP module:
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```
# OS module:
- The OS module in Node.js provides a way to interact with the operating system. It allows you to access information about the system, such as CPU architecture, memory usage, and network interfaces. It also provides methods for performing operations like creating temporary files, getting user information, and managing processes.
- Example of using the OS module to get system information:
```javascript
const os = require('os');

console.log('Platform:', os.platform());
console.log('Architecture:', os.arch());
console.log('Total Memory:', os.totalmem());
console.log('Free Memory:', os.freemem());
``` 
# Path module:
- The Path module in Node.js provides utilities for working with file and directory paths. It allows you to manipulate and resolve file paths in a platform-independent way. The Path module provides methods for joining, resolving, and normalizing paths, as well as extracting information from paths such as the directory name, base name, and file extension.
- Example of using the Path module to manipulate file paths:
```javascript
const path = require('path');
const filePath = '/users/anmi/documents/file.txt';
console.log('Directory Name:', path.dirname(filePath));
console.log('Base Name:', path.basename(filePath));
console.log('File Extension:', path.extname(filePath));
```

# url module:
- The URL module in Node.js provides utilities for URL resolution and parsing. It allows you to work with URLs, including parsing, formatting, and resolving them. The URL module provides methods for extracting components of a URL, such as the protocol, hostname, pathname, query string, and more. It also allows you to construct URLs from individual components.
- Example of using the URL module to parse a URL:
```javascript
const url = require('url');
const myURL = new URL('https://www.example.com:8080/path/name?search=query#hash');
console.log('Protocol:', myURL.protocol);
console.log('Hostname:', myURL.hostname);
console.log('Port:', myURL.port);
console.log('Pathname:', myURL.pathname);
console.log('Query String:', myURL.search);
console.log('Hash:', myURL.hash);
```


## Events module:
- The Events module in Node.js provides a way to create and handle custom events. It allows you to define your own events and attach listeners to them. The Events module provides methods for emitting events, adding event listeners, and removing event listeners. It is commonly used in Node.js applications to handle asynchronous operations and create event-driven architectures.
- Example of using the Events module to create and handle custom events:
```javascript
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
```
```javascript
// Define a custom event
eventEmitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`);
});
// Emit the custom event
eventEmitter.emit('greet', 'Alice');
```
## Async module / Asynchronous Programming:
- The Async module in Node.js provides utilities for working with asynchronous operations. It allows you to manage and control the flow of asynchronous code, making it easier to handle complex asynchronous tasks. The Async module provides methods for handling asynchronous functions, such as parallel execution, series execution, and waterfall execution. It also provides utilities for handling errors and managing callbacks in asynchronous code.
- Example of using the Async module to execute asynchronous functions in parallel:
```javascript
const async = require('async');
``````javascript
async.parallel([
  (callback) => {
    setTimeout(() => {
      console.log('Task 1 completed');
      callback(null, 'Result of Task 1');
    }, 1000);
  },
  (callback) => {
    setTimeout(() => {
      console.log('Task 2 completed');
      callback(null, 'Result of Task 2');
    }, 500);
  }
], (err, results) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('All tasks completed. Results:', results);
  }
});
``` 
Types of asynchronous programming:
- Callbacks: A callback is a function that is passed as an argument to another function and is executed after the completion of an asynchronous operation. It allows you to handle the result of the asynchronous operation once it is completed.
- Promises: A promise is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value. It provides a more structured way to handle asynchronous code, allowing you to chain multiple asynchronous operations together and handle errors more effectively.
- Async/Await: Async/await is a syntactic sugar built on top of promises that allows you to write asynchronous code in a more synchronous and readable manner. It uses the async keyword to define an asynchronous function and the await keyword to pause the execution of the function until a promise is resolved or rejected.
```javascript// Example of using async/await to handle asynchronous code
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Data fetched successfully');
    }, 1000);
  });
};  
const main = async () => {
  try {
    const result = await fetchData();
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
};
main();
```

## Express.js
- Express.js is a popular web application framework for Node.js. It provides a simple and flexible way to build web applications and APIs. Express.js is built on top of the HTTP module in Node.js and provides additional features and utilities for handling routing, middleware, and request/response handling. It allows developers to create robust and scalable web applications with ease.
- It is a Node.js API/backend framework.
- Used to build API (Application program interface) and web applications.
- It simplifies the HTTP module of node.js
- Minimalist, fast and unopinionated framework for building web applications and APIs in Node.js.
- Express.js provides a routing system that allows you to define routes for different HTTP methods (GET, POST, PUT, DELETE, etc.) and handle requests to those routes. It also supports middleware, which are functions that can be executed before or after the route handlers to perform tasks such as authentication, logging, and error handling.

## API (Application Programming Interface):
- API format: JSON (JavaScript Object Notation)
- REST API (Representationl State Transfer)
- REST API is a type of web API that follows the principles of Representational State Transfer (REST). It is an architectural style for designing networked applications. REST APIs use HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources, which are identified by URLs. REST APIs are stateless, meaning that each request from a client to the server must contain all the information needed to understand and process the request. REST APIs are widely used for building web services and are known for their simplicity and scalability.
- Example of a simple REST API endpoint using Express.js:
```javascriptconst express = require('express');
const app = express();
app.get('/api/greet', (req, res) => {
  const name = req.query.name || 'World';
  res.json({ message: `Hello, ${name}!` });
});
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```
## JSON (JavaScript Object Notation):
- JSON is a lightweight data interchange format that is easy for humans to read and write, and
easy for machines to parse and generate. It is based on a subset of the JavaScript programming language and is commonly used for transmitting data between a server and a web application as an alternative to XML. JSON represents data as key-value pairs, where keys are strings and values can be strings, numbers, arrays, objects, or boolean values. JSON is widely used in web development for APIs and data exchange due to its simplicity and compatibility with JavaScript.
- Example of a JSON object:
```json
{
  "name": "Smriti",
  "age": 30,
  "isStudent": false,
  "hobbies": ["reading", "traveling", "coding"],
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "country": "USA"
  }
}
```
- JS Object => JSON.stringify() => JSON 
- JSON => JSON.parse() => JS Object 

## HTTP Methods:
- GET: Used to retrieve data from a server. It is a read-only operation and should not have any side effects on the server. Example: GET /api/users - Retrieves a list of users.
- Get - Read/Fetch

- POST: Used to send data to a server to create a new resource. It is a write operation and can have side effects on the server. Example: POST /api/users - Creates a new user with the provided data.
- POST - Create

- PUT: Used to update an existing resource on the server. It is a write operation and can have side effects on the server. Example: PUT /api/users/123 - Updates the user with ID 123 with the provided data.
- PUT - Update

- DELETE: Used to delete a resource from the server. It is a write operation and can have side effects on the server. Example: DELETE /api/users/123 - Deletes the user with ID 123.
- DELETE - Delete

- PATCH: Used to partially update an existing resource on the server. It is a write operation and can have side effects on the server. Example: PATCH /api/users/123 - Partially updates the user with ID 123 with the provided data.
- PATCH - Partial Update

## Layered Architecture:
- Layered architecture is a software design pattern that organizes the components of an application into distinct layers, each with specific responsibilities. The layers are typically arranged in a hierarchical manner, with each layer depending on the layer below it. The common layers in a layered architecture include:
- API Layer: This layer is responsible for handling incoming requests from clients and sending responses back to them. It defines the endpoints and routes for the application and interacts with the underlying layers to process the requests.
   - Routes: Handle routed/endpoints
   - Controllers: Handle rewquest and response
   - Middleware: Handle request/response, Logging, Authentication, Error handling

- Service Layer: This layer contains the business logic of the application. It processes the data received from the API layer and interacts with the data access layer to perform operations on the database or other external services.
    - Bussiness logic layer - Handle the business logic of the application, such as processing data, performing calculations, and implementing the core functionality of the application.
- Data Access Layer: This layer is responsible for interacting with the database or other data sources. It provides an abstraction over the underlying data storage and allows the service layer to perform CRUD (Create, Read, Update, Delete) operations on the data.
    - Models - Handle the data structure and schema of the application, such as defining the database models and schemas for the application.

- Database Layer: This layer is responsible for storing and retrieving data from the database. It can be implemented using various database technologies, such as relational databases (e.g., MySQL, PostgreSQL) or NoSQL databases (e.g., MongoDB).


## MongoDB
- MongoDB is a popular NoSQL database that uses a document-oriented data model. It is designed to be scalable, flexible, and easy to use. MongoDB stores data in JSON-like documents, which allows for dynamic schemas and makes it easy to work with complex data structures. It provides features such as high availability, horizontal scaling, and rich querying capabilities. MongoDB is commonly used in web applications, real-time analytics, and big data processing.
- NoSQL database
- Non-relational database
- Document-oriented database
- Data are stored in collections & documents
- Database: Main container, all collections are stored here
- Collection: Equivalent to table of relational database
- Document: Equivalent to row of relational database, stored in JSON format
- Field: Equivalent to column of relational database, stored as key-value pair in JSON format
- MongoDB provides a powerful query language that allows you to perform complex queries on the data.

## Tools used

- Locally: MongoDB Compass (Shell included)
- Cloud: MongoDB Atlas (Cloud database service provided by MongoDB)

# Run mongoDB in compass
1. Open MongoDB Compass
2. Click on "New Connection"
3. In the "Connection String" field, enter the connection string for your MongoDB instance. For example: `mongodb://localhost:27017` (if running locally) or the connection string provided by MongoDB Atlas (if using cloud).
4. Click on "Connect" to establish a connection to the MongoDB database.

## MongoDB Queries:
`Show dbs` - Show all databases
`Use <database_name>` - Switch to a specific database
`Show collections` - Show all collections in the current database

1. Create
`db.users.insertOne({ name: "Anamika"})` -
   Insert a single document into the "users" collection
`db.users.insertMany([{ name: "Anamika"}, { name: "Smriti"}])` - Insert multiple documents into the "users" collection
2. Read
`db.users.find()` - Retrieve all documents from the "users" collection
`db.users.find({ name: "Anamika"})` - Retrieve documents from the "users" collection where the name field is "Anamika"
3. Update
`db.users.updateOne({ name: "Anamika"}, { $set: { age: 18}})` - Update a single document in the "users" collection where the name field is "Anamika" and set the age field to 18
4. Delete
`db.users.deleteOne({ name: "Anamika"})` - Delete a single document from the "users" collection where the name field is "Anamika"
`db.users.deleteMany({ name: "Anamika"})` - Delete multiple documents from the "users" collection where the name field is "Anamika"

## Complex filters:
1. $eq: db.users.find({name: {$eq:"Hari"}})
2. $ne: db.users.find({name: {$ne:"Hari"}})
3. $gt/gte: db.users.find({age: {$gt:50}})
4. $lt/lte: db.users.find({age: {$lt:50}})
5. $and: db.users.find({$and: [ {name:"Hari"}, {age:20} ]})
6. $or: db.users.find({$or: [ {name:"Hari"}, {age:45} ]})
7. $in: db.users.find({name: {$in: [ "Hari", "Rohan" ]}})

a. limit: db.users.find().limit(2)
b. skip: db.users.find().skip(1)
c. sort: db.users.find().sort({name:1}) 1: ASC, -1: DESC

## Mongoose
- Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a higher-level abstraction over the MongoDB native driver, making it easier to work with MongoDB in a Node.js application. Mongoose allows you to define schemas for your data models, which can include validation rules, default values, and custom methods. It also provides a powerful query API for performing CRUD operations on your MongoDB collections. With Mongoose, you can easily create and manage relationships between different data models, making it a popular choice for building applications that use MongoDB as the database.

- ODM of MongoDB for Node.js
- Create Schema
- Validate Schema
- Create models using Schema
- Relationships

