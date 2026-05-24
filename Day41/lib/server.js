import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sysInfo from './sysInfo.cjs';

const { getSystemInfo } = sysInfo;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// Helper to format bytes to human-readable size
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

// Check if file is text based on extension
function isPreviewableText(ext) {
  const textExtensions = [
    '.txt', '.md', '.js', '.json', '.html', '.css', 
    '.cjs', '.mjs', '.xml', '.yml', '.yaml', '.ini', 
    '.conf', '.bat', '.sh', '.py', '.ts', '.tsx', '.jsx'
  ];
  return textExtensions.includes(ext.toLowerCase());
}

/**
 * Recursive tree scanner for JSON response
 */
async function scanTree(currentPath, currentDepth = 1, maxDepth = 3) {
  const name = path.basename(currentPath) || currentPath;
  const entryStats = await fs.stat(currentPath);

  if (!entryStats.isDirectory()) {
    return { name, isDirectory: false, size: entryStats.size };
  }

  const node = { name, isDirectory: true, children: [] };

  if (currentDepth > maxDepth) {
    return node;
  }

  try {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });
    
    // Sort directories first
    entries.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

    for (const entry of entries) {
      const childPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        node.children.push(await scanTree(childPath, currentDepth + 1, maxDepth));
      } else {
        const stats = await fs.stat(childPath);
        node.children.push({
          name: entry.name,
          isDirectory: false,
          size: stats.size
        });
      }
    }
  } catch (err) {
    node.error = err.message;
  }

  return node;
}

export function startWebServer(defaultPath = '.') {
  const rootPath = path.resolve(defaultPath);

  const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    
    // Set default headers for API JSON responses
    const jsonHeader = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

    try {
      // 1. API: System Info
      if (pathname === '/api/sysinfo') {
        const info = getSystemInfo();
        res.writeHead(200, jsonHeader);
        return res.end(JSON.stringify(info));
      }

      // 2. API: Directory Listing
      if (pathname === '/api/list') {
        const queryPath = parsedUrl.searchParams.get('path') || '.';
        const targetPath = path.isAbsolute(queryPath) ? queryPath : path.resolve(rootPath, queryPath);
        
        // Ensure path safety (prevent directory traversal attacks out of the user drive structure)
        const stats = await fs.stat(targetPath);
        if (!stats.isDirectory()) {
          res.writeHead(400, jsonHeader);
          return res.end(JSON.stringify({ error: 'Path is not a directory' }));
        }

        const entries = await fs.readdir(targetPath, { withFileTypes: true });
        const items = [];

        for (const entry of entries) {
          const fullPath = path.join(targetPath, entry.name);
          try {
            const entryStats = await fs.stat(fullPath);
            items.push({
              name: entry.name,
              isDirectory: entry.isDirectory(),
              size: entryStats.size,
              sizeFormatted: entry.isDirectory() ? '-' : formatBytes(entryStats.size),
              mode: entryStats.mode,
              mtime: entryStats.mtime
            });
          } catch (e) {
            items.push({
              name: entry.name,
              isDirectory: entry.isDirectory(),
              size: 0,
              sizeFormatted: 'ERROR',
              mode: 0,
              mtime: new Date(0),
              error: e.message
            });
          }
        }

        // Sort folders first
        items.sort((a, b) => {
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.name.localeCompare(b.name);
        });

        res.writeHead(200, jsonHeader);
        return res.end(JSON.stringify({
          currentPath: targetPath,
          parentPath: path.dirname(targetPath),
          items
        }));
      }

      // 3. API: Inspect File
      if (pathname === '/api/inspect') {
        const queryFile = parsedUrl.searchParams.get('file');
        if (!queryFile) {
          res.writeHead(400, jsonHeader);
          return res.end(JSON.stringify({ error: 'Missing file path parameter' }));
        }

        const targetFile = path.isAbsolute(queryFile) ? queryFile : path.resolve(rootPath, queryFile);
        const stats = await fs.stat(targetFile);

        if (stats.isDirectory()) {
          res.writeHead(400, jsonHeader);
          return res.end(JSON.stringify({ error: 'Target is a directory, not a file' }));
        }

        const fileExt = path.extname(targetFile);
        const isText = isPreviewableText(fileExt);
        let preview = '';

        if (isText && stats.size > 0) {
          // Read first 10KB for preview on web to give a slightly richer view
          const buf = Buffer.alloc(Math.min(10240, stats.size));
          const fd = await fs.open(targetFile, 'r');
          await fd.read(buf, 0, buf.length, 0);
          await fd.close();
          preview = buf.toString('utf8');
        }

        res.writeHead(200, jsonHeader);
        return res.end(JSON.stringify({
          name: path.basename(targetFile),
          absolutePath: targetFile,
          size: stats.size,
          sizeFormatted: formatBytes(stats.size),
          mode: stats.mode,
          modeOctal: '0' + (stats.mode & 0o777).toString(8),
          birthtime: stats.birthtime,
          mtime: stats.mtime,
          atime: stats.atime,
          isText,
          preview
        }));
      }

      // 4. API: Tree Data
      if (pathname === '/api/tree') {
        const queryPath = parsedUrl.searchParams.get('path') || '.';
        const targetPath = path.isAbsolute(queryPath) ? queryPath : path.resolve(rootPath, queryPath);
        const treeData = await scanTree(targetPath, 1, 3);
        res.writeHead(200, jsonHeader);
        return res.end(JSON.stringify(treeData));
      }

      // 5. Serve HTML Dashboard
      const indexHtmlPath = path.join(__dirname, 'web', 'index.html');
      try {
        const content = await fs.readFile(indexHtmlPath, 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(content);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end(`Failed to load index.html from ${indexHtmlPath}. Error: ${err.message}`);
      }

    } catch (error) {
      res.writeHead(500, jsonHeader);
      res.end(JSON.stringify({ error: error.message }));
    }
  });

  server.listen(PORT, () => {
    console.log(`\n\x1b[35m\x1b[1m=== Node.js Web Server Started ===\x1b[0m`);
    console.log(`\x1b[36mLocal URL:\x1b[0m    \x1b[32mhttp://localhost:${PORT}\x1b[0m`);
    console.log(`\x1b[36mRoot Folder:\x1b[0m  ${rootPath}`);
    console.log(`\x1b[90mPress Ctrl+C to terminate the web server\x1b[0m\n`);
  });
}
