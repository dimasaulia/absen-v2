export function getRandomMinutes(min = 0, max = 5) {
  if (min > max) {
    throw new Error(
      'Nilai minimum tidak boleh lebih besar dari nilai maksimum'
    );
  }
  const randomMinutes = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomMinutes;
}
