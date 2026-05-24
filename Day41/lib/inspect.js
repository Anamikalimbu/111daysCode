import fs from 'fs/promises';
import { createReadStream } from 'fs';
import path from 'path';

/**
 * Format bytes to human-readable size.
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Convert numeric file mode to Unix-like symbolic representation.
 */
function getSymbolicMode(mode, isDirectory) {
  const isDir = isDirectory ? 'd' : '-';
  const owner = [
    (mode & 0o400) ? 'r' : '-',
    (mode & 0o200) ? 'w' : '-',
    (mode & 0o100) ? 'x' : '-'
  ].join('');
  const group = [
    (mode & 0o040) ? 'r' : '-',
    (mode & 0o020) ? 'w' : '-',
    (mode & 0o010) ? 'x' : '-'
  ].join('');
  const others = [
    (mode & 0o004) ? 'r' : '-',
    (mode & 0o002) ? 'w' : '-',
    (mode & 0o001) ? 'x' : '-'
  ].join('');
  return `${isDir}${owner}${group}${others}`;
}

/**
 * Determine if a file type is previewable as text based on extension.
 */
function isPreviewableText(ext) {
  const textExtensions = [
    '.txt', '.md', '.js', '.json', '.html', '.css', 
    '.cjs', '.mjs', '.xml', '.yml', '.yaml', '.ini', 
    '.conf', '.bat', '.sh', '.py', '.ts', '.tsx', '.jsx'
  ];
  return textExtensions.includes(ext.toLowerCase());
}

/**
 * Inspect details of a specific file.
 * @param {string} filePath 
 * @param {Object} options 
 */
export async function inspectFile(filePath, options = {}) {
  const useColor = options.color !== false;

  const colors = {
    reset: useColor ? '\x1b[0m' : '',
    cyan: useColor ? '\x1b[36m' : '',
    magenta: useColor ? '\x1b[35m' : '',
    blue: useColor ? '\x1b[1;34m' : '',
    green: useColor ? '\x1b[32m' : '',
    yellow: useColor ? '\x1b[33m' : '',
    gray: useColor ? '\x1b[90m' : '',
    red: useColor ? '\x1b[31m' : ''
  };

  try {
    const resolvedPath = path.resolve(filePath);
    const stats = await fs.stat(resolvedPath);

    if (stats.isDirectory()) {
      throw new Error(`Path is a directory, not a file. Use 'list' to view directory contents.`);
    }

    const fileName = path.basename(resolvedPath);
    const fileExt = path.extname(resolvedPath);
    const permissions = getSymbolicMode(stats.mode, false);
    const octalMode = '0' + (stats.mode & 0o777).toString(8);

    console.log(`\n${colors.magenta}=== File Inspection ===${colors.reset}`);
    console.log(`${colors.cyan}Name:${colors.reset}           ${fileName}`);
    console.log(`${colors.cyan}Extension:${colors.reset}      ${fileExt || '(none)'}`);
    console.log(`${colors.cyan}Absolute Path:${colors.reset}  ${resolvedPath}`);
    console.log(`${colors.cyan}Size:${colors.reset}           ${formatBytes(stats.size)} (${stats.size} bytes)`);
    console.log(`${colors.cyan}Permissions:${colors.reset}    Symbolic: ${colors.yellow}${permissions}${colors.reset} | Octal: ${colors.yellow}${octalMode}${colors.reset}`);
    console.log(`${colors.cyan}Created At:${colors.reset}     ${stats.birthtime.toLocaleString()}`);
    console.log(`${colors.cyan}Modified At:${colors.reset}    ${stats.mtime.toLocaleString()}`);
    console.log(`${colors.cyan}Accessed At:${colors.reset}    ${stats.atime.toLocaleString()}`);

    // If it's a previewable text file, load a preview chunk using Node Streams
    if (isPreviewableText(fileExt) && stats.size > 0) {
      console.log(`\n${colors.magenta}--- Preview (First 1KB via Streams) ---${colors.reset}`);
      
      // We wrap the stream operation in a promise to control the async execution flow
      const previewText = await new Promise((resolve) => {
        // Read stream configured to read the first 1KB (0-1023 bytes)
        const stream = createReadStream(resolvedPath, {
          encoding: 'utf8',
          start: 0,
          end: 1023
        });

        let dataBuffer = '';

        stream.on('data', (chunk) => {
          dataBuffer += chunk;
        });

        stream.on('end', () => {
          resolve(dataBuffer);
        });

        stream.on('error', (err) => {
          resolve(`${colors.red}[Error reading preview stream: ${err.message}]${colors.reset}`);
        });
      });

      // Split lines and render with line numbers for premium look
      const lines = previewText.split(/\r?\n/);
      lines.forEach((line, index) => {
        console.log(`${colors.gray}${String(index + 1).padStart(3, ' ')} │${colors.reset} ${line}`);
      });

      if (stats.size > 1024) {
        console.log(`${colors.gray}... [Truncated: File is larger than 1KB]${colors.reset}`);
      }
      console.log(`${colors.magenta}---------------------------------------${colors.reset}\n`);
    } else if (stats.size === 0) {
      console.log(`\n${colors.gray}(File is empty - no content to preview)${colors.reset}\n`);
    } else {
      console.log(`\n${colors.yellow}Preview skipped for binary/unsupported file types.${colors.reset}\n`);
    }

  } catch (error) {
    console.error(`${colors.red}Error inspecting file: ${error.message}${colors.reset}`);
    throw error;
  }
}
