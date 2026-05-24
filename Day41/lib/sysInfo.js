const os = require('os');

/**
 * Format system uptime into a human-readable string.
 * @param {number} seconds 
 * @returns {string}
 */
function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

/**
 * Helper to convert bytes to human-readable size.
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Fetch hardware and operating system statistics.
 * @returns {Object}
 */
function getSystemInfo() {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memUsagePercent = ((usedMem / totalMem) * 100).toFixed(1);

  // Group network interfaces by name and filter for IPv4
  const interfaces = os.networkInterfaces();
  const networkSummary = [];
  for (const [name, info] of Object.entries(interfaces)) {
    const ipv4 = info.find(addr => addr.family === 'IPv4' && !addr.internal);
    if (ipv4) {
      networkSummary.push({ interface: name, address: ipv4.address });
    }
  }

  return {
    platform: os.platform(),
    release: os.release(),
    type: os.type(),
    arch: os.arch(),
    hostname: os.hostname(),
    uptimeRaw: os.uptime(),
    uptimeFormatted: formatUptime(os.uptime()),
    cpuModel: cpus.length > 0 ? cpus[0].model : 'Unknown',
    cpuCores: cpus.length,
    cpuSpeedMhz: cpus.length > 0 ? cpus[0].speed : 0,
    totalMemoryRaw: totalMem,
    totalMemoryFormatted: formatBytes(totalMem),
    freeMemoryRaw: freeMem,
    freeMemoryFormatted: formatBytes(freeMem),
    usedMemoryRaw: usedMem,
    usedMemoryFormatted: formatBytes(usedMem),
    memoryUsagePercent: memUsagePercent,
    homeDir: os.homedir(),
    network: networkSummary,
    loadAverage: os.platform() !== 'win32' ? os.loadavg() : null // os.loadavg() is not supported on Windows
  };
}

module.exports = {
  getSystemInfo
};
