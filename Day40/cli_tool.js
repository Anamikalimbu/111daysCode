import fs from 'fs/promises';
import path from 'path';
import os from 'os';

// Parse command line arguments
const args = process.argv.slice(2);

// Check if help flag is present
if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

// Check for other flags
const isRecursive = args.includes('--recursive') || args.includes('-r');
const isJson = args.includes('--json') || args.includes('-j');

// Filter out options to get the target path
const pathArguments = args.filter(arg => !arg.startsWith('-'));
const targetDir = pathArguments[0] ? path.resolve(pathArguments[0]) : process.cwd();

// Formatting Helper: Bytes to human-readable size
function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

// Display Help Menu
function showHelp() {
  console.log(`
\x1b[35m===  CLI Directory Explorer (Day 2 Task) ===\x1b[0m
  
  \x1b[36mUsage:\x1b[0m
    node cli_tool.js [directory_path] [options]

  \x1b[36mOptions:\x1b[0m
    -h, --help       Show this help panel
    -r, --recursive  Recursively traverse and list files in subdirectories
    -j, --json       Output details as a raw JSON string
    
  \x1b[36mExamples:\x1b[0m
    node cli_tool.js .
    node cli_tool.js ../Day39 --recursive
    node cli_tool.js C:\\Users -j
  `);
}

// Main execution function
async function main() {
  try {
    // Validate directory exists and is actually a directory
    const stats = await fs.stat(targetDir);
    if (!stats.isDirectory()) {
      console.error(`\x1b[31mError: Path "${targetDir}" is a file, not a directory.\x1b[0m`);
      process.exit(1);
    }

    if (!isJson) {
      console.log(`\x1b[36mScanning Directory:\x1b[0m ${targetDir}`);
      console.log(`\x1b[36mOS Platform:\x1b[0m        ${os.platform()}`);
      console.log(`\x1b[35m--------------------------------------------------\x1b[0m`);
    }

    const files = await scanDirectory(targetDir, isRecursive);

    if (isJson) {
      console.log(JSON.stringify(files, null, 2));
    } else {
      if (files.length === 0) {
        console.log('No files found.');
      } else {
        files.forEach(file => {
          const typeLabel = file.isDirectory ? '\x1b[34m[DIR]\x1b[0m ' : '\x1b[32m[FILE]\x1b[0m';
          const sizeLabel = file.isDirectory ? '       -' : ` ${formatSize(file.size)}`;
          const relativePath = path.relative(targetDir, file.absolutePath);
          console.log(`${typeLabel.padEnd(16)} | ${sizeLabel.padEnd(10)} | ${relativePath}`);
        });
      }
      console.log(`\x1b[35m--------------------------------------------------\x1b[0m`);
      console.log(`\x1b[32mTotal Items Found: ${files.length}\x1b[0m`);
    }
  } catch (error) {
    console.error(`\x1b[31mError accessing path:\x1b[0m ${error.message}`);
    process.exit(1);
  }
}

// Recursive directory scanner
async function scanDirectory(dirPath, recursive = false) {
  let fileList = [];
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    try {
      const stats = await fs.stat(fullPath);
      
      const fileDetail = {
        name: entry.name,
        absolutePath: fullPath,
        isDirectory: entry.isDirectory(),
        size: stats.size,
        createdAt: stats.birthtime
      };

      fileList.push(fileDetail);

      // If recursive and entry is directory, traverse deeper
      if (recursive && entry.isDirectory()) {
        const subDirFiles = await scanDirectory(fullPath, true);
        fileList = fileList.concat(subDirFiles);
      }
    } catch (e) {
      // Handle permission issues or file system locks gracefully
      continue;
    }
  }

  return fileList;
}

// Run the script
main();
