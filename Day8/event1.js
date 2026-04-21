// app.js
import { EventEmitter } from 'events';

const myEmitter = new EventEmitter();

// 1. Define the event listener
myEmitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`);
});

// 2. Emit the event
console.log("Starting event...");
myEmitter.emit('greet', 'Node.js Developer');
