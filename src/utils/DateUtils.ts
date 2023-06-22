export function getCurrentDate() {
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}