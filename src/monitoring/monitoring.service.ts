import { MemoryStat } from './monitoring.model';
import v8 from 'node:v8';

export class MonitoringService {
  static getServerStatistic(): MemoryStat {
    const memory = process.memoryUsage();
    const heapStats = v8.getHeapStatistics();
    const ssr = memory.rss;
    const heapUsed = memory.heapUsed;
    const heapTotal = memory.heapTotal;
    const heapLimit = heapStats.heap_size_limit;
    const external = memory.external;
    const arrayBuffers = memory.arrayBuffers;

    return {
      ssrBytes: ssr,
      heapUsedBytes: heapUsed,
      heapTotalBytes: heapTotal,
      heapLimitBytes: heapLimit,
      externalBytes: external,
      arrayBuffersBytes: arrayBuffers,
    };
  }
}
