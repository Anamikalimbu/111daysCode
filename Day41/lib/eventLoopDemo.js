import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Run a live interactive demo showcasing the Node.js Event Loop execution order.
 */
export function runEventLoopDemo() {
  const useColor = true;

  const colors = {
    reset: useColor ? '\x1b[0m' : '',
    cyan: useColor ? '\x1b[36m' : '',
    magenta: useColor ? '\x1b[35m' : '',
    blue: useColor ? '\x1b[1;34m' : '',
    green: useColor ? '\x1b[32m' : '',
    yellow: useColor ? '\x1b[33m' : '',
    gray: useColor ? '\x1b[90m' : '',
    red: useColor ? '\x1b[31m' : '',
    bold: useColor ? '\x1b[1m' : ''
  };

  console.log(`\n${colors.magenta}${colors.bold}=== Interactive Node.js Event Loop Demonstration ===${colors.reset}`);
  console.log(`${colors.gray}This demo schedules callbacks in various phases of the Node.js Event Loop.${colors.reset}`);
  console.log(`${colors.gray}Watch the exact order of execution print to understand microtasks vs macrotasks.\n${colors.reset}`);

  console.log(`${colors.cyan}[1] === STARTING SYNCHRONOUS CODE (Call Stack) ===${colors.reset}`);

  // 1. Timer phase macrotask (setTimeout)
  console.log(`${colors.yellow}--> Scheduling setTimeout (Timer Phase, 0ms)${colors.reset}`);
  setTimeout(() => {
    console.log(`\n${colors.green}[Timer Phase] ⏰ setTimeout(..., 0) callback executed!${colors.reset}`);
    console.log(`${colors.gray}   (Runs after microtasks are cleared, during the Timer phase.)${colors.reset}`);
  }, 0);

  // 2. Check phase macrotask (setImmediate)
  console.log(`${colors.yellow}--> Scheduling setImmediate (Check Phase)${colors.reset}`);
  setImmediate(() => {
    console.log(`\n${colors.green}[Check Phase] ⚡ setImmediate(...) callback executed!${colors.reset}`);
    console.log(`${colors.gray}   (Runs in the Check phase, which immediately follows the Poll phase.)${colors.reset}`);
  });

  // 3. Process nextTick microtask
  console.log(`${colors.yellow}--> Scheduling process.nextTick (Microtask Queue)${colors.reset}`);
  process.nextTick(() => {
    console.log(`\n${colors.blue}[Microtask Queue] 🟢 process.nextTick executed!${colors.reset}`);
    console.log(`${colors.gray}   (Node-specific microtask. Executes IMMEDIATELY after the current operation finishes, before Promises.)${colors.reset}`);
  });

  // 4. Promise microtask
  console.log(`${colors.yellow}--> Scheduling Promise.then (Microtask Queue)${colors.reset}`);
  Promise.resolve().then(() => {
    console.log(`\n${colors.blue}[Microtask Queue] 🔵 Promise.then executed!${colors.reset}`);
    console.log(`${colors.gray}   (Standard ES6 Microtask. Executes right after process.nextTick queues are fully drained.)${colors.reset}`);
  });

  // 5. Asynchronous I/O macrotask (Poll Phase)
  console.log(`${colors.yellow}--> Scheduling fs.readFile I/O operation (Poll Phase)${colors.reset}`);
  const tempFile = path.join(__dirname, 'temp_event_loop_demo.txt');
  fs.writeFileSync(tempFile, 'Event Loop Demo content');

  fs.readFile(tempFile, 'utf8', (err, data) => {
    if (err) return;
    console.log(`\n${colors.green}[Poll Phase] 💾 fs.readFile I/O callback executed!${colors.reset}`);
    console.log(`${colors.gray}   (Asynchronous file operations complete in the thread pool, and their callbacks execute during the Poll phase.)${colors.reset}`);

    console.log(`\n${colors.cyan}[Event Loop Insight - Inside I/O Callback]${colors.reset}`);
    console.log(`${colors.gray}We are now deep inside the Poll phase callback. Let's schedule another setTimeout and setImmediate here.${colors.reset}`);
    console.log(`${colors.yellow}--> Inside I/O: Scheduling setTimeout(..., 0)${colors.reset}`);
    console.log(`${colors.yellow}--> Inside I/O: Scheduling setImmediate(...)${colors.reset}`);

    // Since we are in the Poll phase, Check phase (setImmediate) is visited BEFORE the Timer phase is returned to.
    // Therefore, in an I/O callback, setImmediate is GUARANTEED to execute first. Let's prove it!
    setTimeout(() => {
      console.log(`\n${colors.red}[Timer Phase - Inside I/O] ⏰ setTimeout callback ran!${colors.reset}`);
      console.log(`${colors.gray}   (Executed in the next tick's Timer phase.)${colors.reset}`);
      
      // Cleanup temp file
      try {
        fs.unlinkSync(tempFile);
      } catch (e) {}
      
      console.log(`\n${colors.magenta}${colors.bold}=== End of Event Loop Demonstration ===${colors.reset}\n`);
    }, 0);

    setImmediate(() => {
      console.log(`\n${colors.green}[Check Phase - Inside I/O] ⚡ setImmediate callback ran!${colors.reset}`);
      console.log(`${colors.bold}${colors.yellow}   🔥 CRITICAL PROOF: setImmediate executed BEFORE setTimeout inside I/O callback!${colors.reset}`);
      console.log(`${colors.gray}   (Why? Because the Event Loop transitions from Poll phase -> Check phase before circling back to Timer phase.)${colors.reset}`);
    });
  });

  console.log(`${colors.cyan}[2] === SYNCHRONOUS CODE ENDING ===${colors.reset}`);
  console.log(`${colors.gray}The Call Stack is now emptying. Handing control to the Event Loop queues...${colors.reset}`);
}
