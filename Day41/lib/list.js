import fs from 'fs/promises';
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
 * List the contents of a directory.
 * @param {string} targetPath 
 * @param {Object} options 
 */
export async function listDirectory(targetPath, options = {}) {
  const useColor = options.color !== false;
  
  // Terminal Colors helper
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
    const resolvedPath = path.resolve(targetPath);
    const dirStats = await fs.stat(resolvedPath);

    if (!dirStats.isDirectory()) {
      throw new Error(`Path is not a directory: ${resolvedPath}`);
    }

    console.log(`\n${colors.magenta}=== Directory Listing ===${colors.reset}`);
    console.log(`${colors.cyan}Directory:${colors.reset} ${resolvedPath}\n`);

    const entries = await fs.readdir(resolvedPath, { withFileTypes: true });

    if (entries.length === 0) {
      console.log(`${colors.gray}(Directory is empty)${colors.reset}`);
      return;
    }

    const items = [];
    let totalFiles = 0;
    let totalDirs = 0;
    let totalSize = 0;

    // Retrieve stats asynchronously in parallel for high performance
    const statPromises = entries.map(async (entry) => {
      const fullPath = path.join(resolvedPath, entry.name);
      try {
        const stats = await fs.stat(fullPath);
        const isDir = entry.isDirectory();
        
        if (isDir) {
          totalDirs++;
        } else {
          totalFiles++;
          totalSize += stats.size;
        }

        return {
          name: entry.name,
          isDirectory: isDir,
          size: stats.size,
          mode: stats.mode,
          mtime: stats.mtime,
          error: null
        };
      } catch (err) {
        // Return item with error but don't fail the whole listing
        return {
          name: entry.name,
          isDirectory: entry.isDirectory(),
          size: 0,
          mode: 0,
          mtime: new Date(0),
          error: err.message
        };
      }
    });

    const resolvedItems = await Promise.all(statPromises);

    // Sort: directories first, then files alphabetically
    resolvedItems.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });

    // Render Table Header
    console.log(
      `${colors.cyan}${'Permissions'.padEnd(12)} ${'Size'.padStart(10)}   ${'Last Modified'.padEnd(20)}   ${'Name'}${colors.reset}`
    );
    console.log(
      `${colors.gray}--------------------------------------------------------------------------------${colors.reset}`
    );

    // Render Rows
    resolvedItems.forEach(item => {
      if (item.error) {
        console.log(
          `${colors.red}${'?????????'.padEnd(12)} ${'ERROR'.padStart(10)}   ${'--'.padEnd(20)}   ${item.name} (${item.error})${colors.reset}`
        );
        return;
      }

      const permissions = getSymbolicMode(item.mode, item.isDirectory);
      const sizeStr = item.isDirectory ? '-' : formatBytes(item.size);
      
      // Format Date
      const date = item.mtime;
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

      const nameColor = item.isDirectory ? colors.blue : colors.green;
      const typeIndicator = item.isDirectory ? '/' : '';

      console.log(
        `${colors.cyan}${permissions.padEnd(12)}${colors.reset} ` +
        `${colors.yellow}${sizeStr.padStart(10)}${colors.reset}   ` +
        `${colors.gray}${formattedDate.padEnd(20)}${colors.reset}   ` +
        `${nameColor}${item.name}${typeIndicator}${colors.reset}`
      );
    });

    console.log(
      `${colors.gray}--------------------------------------------------------------------------------${colors.reset}`
    );
    console.log(
      `${colors.cyan}Summary:${colors.reset} ` +
      `${colors.magenta}${totalDirs}${colors.reset} Directories, ` +
      `${colors.magenta}${totalFiles}${colors.reset} Files ` +
      `${colors.gray}(Total size: ${formatBytes(totalSize)})${colors.reset}\n`
    );

  } catch (error) {
    console.error(`${colors.red}Error listing directory: ${error.message}${colors.reset}`);
    throw error;
  }
}
