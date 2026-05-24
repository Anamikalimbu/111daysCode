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