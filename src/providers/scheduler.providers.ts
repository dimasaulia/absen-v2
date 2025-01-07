import { logger } from './logging.providers';

export class Scheduler {
  private static SCHEDULER_LIST: { [key: string]: { timer: NodeJS.Timer } } =
    {};

  /**
   * Function that will call the given function at the specified time.
   * @name setTask
   * @param {Date} date `date` a Date object or a string that can be passed to the Date constructor.
   * @param {Function} fn `fn` Function to execute at the specified time.
   * @param {string | null} taskId `taskId` Optional task ID.
   * @returns {string} Returns a string ID that can be used to cancel the task.
   */
  static setTask(
    date: Date | string,
    fn: () => Promise<void>,
    taskId: string | null = null
  ): string {
    let id = taskId;
    if (id == null) {
      id = crypto.randomUUID();
    }
    if (typeof fn !== 'function') {
      throw new Error('expected second argument to be a function');
    }

    date = new Date(date);
    const now = new Date();
    const ms = date.getTime() - now.getTime();
    const timer = setTimeout(fn, ms);
    Scheduler.SCHEDULER_LIST[id] = { timer: timer };

    logger.info(
      `New scheduler with id ${id} set to run on ${new Date(
        date
      ).toISOString()}`
    );
    return id;
  }

  /**
   * Showing All Task List
   * @returns {Object} Object of tasks
   */
  static getTask(): { [key: string]: { timer: NodeJS.Timer } } {
    return Scheduler.SCHEDULER_LIST;
  }

  static removeTask(id: string): void {
    const task = Scheduler.SCHEDULER_LIST[id];
    if (task == undefined) {
      logger.info("Task ID Can't Be Found");
      return;
    }
    logger.info(`Task ${id} Was Removed`);
    clearTimeout(task.timer);
    delete Scheduler.SCHEDULER_LIST[id];
  }
}

export default Scheduler;
