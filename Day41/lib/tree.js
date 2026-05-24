import fs from 'fs/promises';
import path from 'path';

/**
 * Generate and display a visual tree structure of a directory.
 * @param {string} targetPath 
 * @param {Object} options 
 */
export async function renderTree(targetPath, options = {}) {
  const useColor = options.color !== false;
  const maxDepth = options.depth !== undefined ? parseInt(options.depth, 10) : 3; // default depth limit is 3

  const colors = {
    reset: useColor ? '\x1b[0m' : '',
    cyan: useColor ? '\x1b[36m' : '',
    magenta: useColor ? '\x1b[35m' : '',
    blue: useColor ? '\x1b[1;34m' : '',
    green: useColor ? '\x1b[32m' : '',
    gray: useColor ? '\x1b[90m' : '',
    yellow: useColor ? '\x1b[33m' : '',
    red: useColor ? '\x1b[31m' : ''
  };

  try {
    const resolvedPath = path.resolve(targetPath);
    const rootStats = await fs.stat(resolvedPath);

    if (!rootStats.isDirectory()) {
      throw new Error(`Path is not a directory: ${resolvedPath}`);
    }

    console.log(`\n${colors.magenta}=== Directory Tree ===${colors.reset}`);
    console.log(`${colors.cyan}Root:${colors.reset} ${resolvedPath}`);
    console.log(`${colors.gray}(Max Depth limit: ${maxDepth})${colors.reset}\n`);

    // Output root node name
    console.log(`${colors.blue}${path.basename(resolvedPath) || resolvedPath}/${colors.reset}`);

    // Track statistics during traversal
    const stats = { directories: 0, files: 0 };

    /**
     * Recursive function to scan and print the tree structure.
     */
    async function traverse(currentPath, prefix = '', currentDepth = 1) {
      if (currentDepth > maxDepth) {
        return;
      }

      let entries;
      try {
        entries = await fs.readdir(currentPath, { withFileTypes: true });
      } catch (err) {
        console.log(`${prefix}└── ${colors.red}[Error reading directory: ${err.message}]${colors.reset}`);
        return;
      }

      // Sort entries: directories first, then files alphabetically
      entries.sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name);
      });

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const isLast = i === entries.length - 1;
        const branch = isLast ? '└── ' : '├── ';
        const fullPath = path.join(currentPath, entry.name);
        const isDir = entry.isDirectory();

        if (isDir) {
          stats.directories++;
          console.log(`${prefix}${colors.gray}${branch}${colors.reset}${colors.blue}${entry.name}/${colors.reset}`);
          
          // Recurse into directory
          const nextPrefix = prefix + (isLast ? '    ' : '│   ');
          await traverse(fullPath, nextPrefix, currentDepth + 1);
        } else {
          stats.files++;
          let fileStats = '';
          try {
            const fStat = await fs.stat(fullPath);
            const sizeKB = (fStat.size / 1024).toFixed(1);
            fileStats = ` ${colors.gray}(${sizeKB} KB)${colors.reset}`;
          } catch (e) {
            // Ignore error fetching file size
          }
          console.log(`${prefix}${colors.gray}${branch}${colors.reset}${colors.green}${entry.name}${colors.reset}${fileStats}`);
        }
      }
    }

    await traverse(resolvedPath, '', 1);

    console.log(
      `\n${colors.cyan}Tree Scan Complete:${colors.reset} ` +
      `${colors.magenta}${stats.directories}${colors.reset} Directories, ` +
      `${colors.magenta}${stats.files}${colors.reset} Files\n`
    );

  } catch (error) {
    console.error(`${colors.red}Error generating tree: ${error.message}${colors.reset}`);
    throw error;
  }
}
