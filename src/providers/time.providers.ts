export function getRandomMinutes(min = 0, max = 5) {
  if (min > max) {
    return 1;
  }
  const randomMinutes = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomMinutes;
}

export function formatScheduleTime(date: Date): string {
  // ... existing code ...
  const clonedDate = new Date(date.getTime()); // Clone the original date
  const changeDate = new Date(
    clonedDate.setSeconds(clonedDate.getSeconds() + 30)
  );

  const day = String(changeDate.getDate()).padStart(2, '0');
  const month = String(changeDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = changeDate.getFullYear();
  const hours = String(changeDate.getHours()).padStart(2, '0');
  const minutes = String(changeDate.getMinutes()).padStart(2, '0');
  const seconds = String(changeDate.getSeconds()).padStart(2, '0');

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}
