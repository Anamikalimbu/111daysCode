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