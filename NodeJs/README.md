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
