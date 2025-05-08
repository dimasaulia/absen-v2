import { Hono } from 'hono';
import v8 from 'node:v8';
import { MonitoringService } from './monitoring.service';

export const monitoringController = new Hono();

monitoringController.get('/metrics', async (c) => {
  const stat = MonitoringService.getServerStatistic();

  const text = `
    # HELP program_memory Show how much program use system memory
    # TYPE program_memory gauge
    resident_set_size_bytes{program="be-absen", env="${
      Bun.env?.ENV || 'n/a'
    }"} ${stat.ssrBytes.toFixed(2)}
    heap_limit_bytes{program="be-absen", env="${
      Bun.env?.ENV || 'n/a'
    }"} ${stat.heapLimitBytes.toFixed(2)}
    heap_used_bytes{program="be-absen", env="${
      Bun.env?.ENV || 'n/a'
    }"} ${stat.heapUsedBytes.toFixed(2)}
    heap_total_bytes{program="be-absen", env="${
      Bun.env?.ENV || 'n/a'
    }"} ${stat.heapTotalBytes.toFixed(2)}
    external_bytes{program="be-absen", env="${
      Bun.env?.ENV || 'n/a'
    }"} ${stat.externalBytes.toFixed(2)}
    array_buffers_bytes{program="be-absen", env="${
      Bun.env?.ENV || 'n/a'
    }"} ${stat.arrayBuffersBytes.toFixed(2)}
  `
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');

  c.header('Content-Type', 'text/plain; version=0.0.4');
  return c.text(text);
});

monitoringController.get('/stat', async (c) => {
  const stat = MonitoringService.getServerStatistic();
  return c.json({
    description: 'Server metric in MB',
    ssr: stat.ssrBytes / 1024 / 1024,
    heapUsed: stat.heapUsedBytes / 1024 / 1024,
    heapTotal: stat.heapTotalBytes / 1024 / 1024,
    heapLimit: stat.heapLimitBytes / 1024 / 1024,
    external: stat.externalBytes / 1024 / 1024,
    arrayBuffers: stat.arrayBuffersBytes / 1024 / 1024,
  });
});

monitoringController.get('/check', async (c) => {
  return c.text('OK');
});
