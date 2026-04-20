// ## Events module:
// - The Events module in Node.js provides a way to create and handle custom events. It allows you to define your own events and attach listeners to them. The Events module provides methods for emitting events, adding event listeners, and removing event listeners. It is commonly used in Node.js applications to handle asynchronous operations and create event-driven architectures.
// - Example of using the Events module to create and handle custom events:
// ```javascript
// const EventEmitter = require('events');
// const eventEmitter = new EventEmitter();
// ```
// ```javascript
// Define a custom event
// eventEmitter.on('greet', (name) => {
//   console.log(`Hello, ${name}!`);
// });
// Emit the custom event
// eventEmitter.emit('greet', 'Alice');
// ```

import Event from 'events';
const eventEmitter = new Event();
 //eventEmitter: 1. on() - Listen for an event to occur.
 //              2. emit() - Emit an event.
 //              3. removeListener() - Remove an event listener.
 //              4. once() - Listen for an event only once.

eventEmitter.on("greet", () => {
  console.log("Hello World!");
});
eventEmitter.emit("greet");