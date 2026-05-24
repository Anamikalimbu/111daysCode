import path from 'path';
import { listDirectory } from './lib/list.js';
import { renderTree } from './lib/tree.js';
import { inspectFile } from './lib/inspect.js';
import sysInfo from './lib/sysInfo.cjs';
import { runEventLoopDemo } from './lib/eventLoopDemo.js';
import { startWebServer } from './lib/server.js';

const { getSystemInfo } = sysInfo;

// Parse core arguments
const rawArgs = process.argv.slice(2);

// Check flags
const useColor = !rawArgs.includes('--no-color') && !rawArgs.includes('-nc');
const helpRequested = rawArgs.includes('--help') || rawArgs.includes('-h');

// Setup color tokens
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

// Help Panel Function
function showHelp() {
  console.log(`
${colors.magenta}${colors.bold}┌──────────────────────────────────────────────────────────┐
│   🪐  NODE.JS CLI FILE EXPLORER & SYSTEM INSPECTOR  🪐   │
└──────────────────────────────────────────────────────────┘${colors.reset}

${colors.bold}An advanced modular CLI toolkit built using Node.js core APIs.${colors.reset}
Demonstrates: Non-blocking Async I/O, Event Loop scheduling, streams, and ESM+CJS interoperability.

${colors.cyan}${colors.bold}Usage:${colors.reset}
  node explorer.js <command> [arguments] [options]

${colors.cyan}${colors.bold}Commands:${colors.reset}
  ${colors.green}list, ls [path]${colors.reset}        List details of a directory's contents. (Defaults to current directory)
  ${colors.green}tree [path]${colors.reset}            Render a recursive, visual layout of folders and files.
  ${colors.green}inspect, view <file>${colors.reset}   Detailed file statistics and a stream-based text preview (1KB).
  ${colors.green}sysinfo, sys${colors.reset}           Fetch comprehensive hardware, OS, and network configurations.
  ${colors.green}demo${colors.reset}                   Run a live, interactive tutorial proving Event Loop timing phases.
  ${colors.green}serve, web [path]${colors.reset}      Start a high-performance local web HTTP server for browser access.

${colors.cyan}${colors.bold}Options:${colors.reset}
  ${colors.yellow}-h, --help${colors.reset}           Display this instructional reference.
  ${colors.yellow}-nc, --no-color${colors.reset}      Disable ANSI color rendering in the terminal.
  ${colors.yellow}-d, --depth <num>${colors.reset}     Specify maximum recursion depth for the 'tree' command. (Default: 3)

${colors.cyan}${colors.bold}Examples:${colors.reset}
  node explorer.js list .
  node explorer.js tree ../Day40 -d 2
  node explorer.js inspect ./package.json
  node explorer.js sysinfo
  node explorer.js demo
  `);
}

// Router Logic
async function main() {
  if (helpRequested || rawArgs.length === 0) {
    showHelp();
    process.exit(0);
  }

  // Extract option-filtered arguments
  const args = rawArgs.filter(arg => !arg.startsWith('-') && arg !== 'ls');
  
  // Find tree depth flag if it exists
  let depth = 3;
  const depthIndex = rawArgs.findIndex(arg => arg === '--depth' || arg === '-d');
  if (depthIndex !== -1 && rawArgs[depthIndex + 1]) {
    const parsed = parseInt(rawArgs[depthIndex + 1], 10);
    if (!isNaN(parsed)) {
      depth = parsed;
    }
  }

  const command = rawArgs[0].toLowerCase();

  try {
    switch (command) {
      case 'list':
      case 'ls': {
        const targetPath = args[1] || '.';
        await listDirectory(targetPath, { color: useColor });
        break;
      }

      case 'tree': {
        const targetPath = args[1] || '.';
        await renderTree(targetPath, { color: useColor, depth });
        break;
      }

      case 'inspect':
      case 'view': {
        const targetFile = args[1];
        if (!targetFile) {
          console.error(`${colors.red}Error: Please specify the file path to inspect.${colors.reset}`);
          console.log(`${colors.gray}Example: node explorer.js inspect ./package.json${colors.reset}\n`);
          process.exit(1);
        }
        await inspectFile(targetFile, { color: useColor });
        break;
      }

      case 'sysinfo':
      case 'sys': {
        const info = getSystemInfo();
        
        console.log(`\n${colors.magenta}${colors.bold}=== System & Hardware Configuration ===${colors.reset}`);
        console.log(`${colors.cyan}Hostname:${colors.reset}      ${info.hostname}`);
        console.log(`${colors.cyan}OS Platform:${colors.reset}   ${info.platform} (${info.type} ${info.arch})`);
        console.log(`${colors.cyan}OS Release:${colors.reset}    ${info.release}`);
        console.log(`${colors.cyan}Uptime:${colors.reset}        ${info.uptimeFormatted}`);
        console.log(`${colors.cyan}Home Directory:${colors.reset}${info.homeDir}`);
        console.log(`${colors.cyan}CPU Model:${colors.reset}     ${info.cpuModel}`);
        console.log(`${colors.cyan}CPU Cores:${colors.reset}     ${info.cpuCores} cores @ ${info.cpuSpeedMhz} MHz`);
        console.log(`${colors.cyan}Memory Usage:${colors.reset}  ${colors.yellow}${info.memoryUsagePercent}%${colors.reset} used (${info.usedMemoryFormatted} / ${info.totalMemoryFormatted} total, ${info.freeMemoryFormatted} free)`);
        
        if (info.loadAverage) {
          console.log(`${colors.cyan}Load Averages:${colors.reset} 1m: ${info.loadAverage[0].toFixed(2)}, 5m: ${info.loadAverage[1].toFixed(2)}, 15m: ${info.loadAverage[2].toFixed(2)}`);
        }

        console.log(`\n${colors.magenta}--- Active Network Interfaces ---${colors.reset}`);
        if (info.network.length === 0) {
          console.log(`${colors.gray}(No external network interfaces detected)${colors.reset}`);
        } else {
          info.network.forEach(net => {
            console.log(`${colors.cyan}${net.interface.padEnd(15)}${colors.reset} IP Address: ${colors.green}${net.address}${colors.reset}`);
          });
        }
        console.log();
        break;
      }

      case 'demo': {
        runEventLoopDemo();
        break;
      }

      case 'serve':
      case 'web': {
        const targetPath = args[1] || '.';
        startWebServer(targetPath);
        break;
      }

      default: {
        console.error(`${colors.red}Error: Unknown command "${command}"${colors.reset}`);
        showHelp();
        process.exit(1);
      }
    }
  } catch (error) {
    // Elegant fallback in case of router crashes
    console.error(`\n${colors.red}${colors.bold}CLI Runtime Failure:${colors.reset} ${error.message}`);
    process.exit(1);
  }
}

main();
