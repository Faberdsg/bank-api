export function generateAccountNumber(): string {
  const timestamp = Date.now().toString().slice(-8);
  const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();
  return timestamp + randomDigits;
}
