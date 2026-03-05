export function waLink(whatsappDigits, text) {
  const msg = encodeURIComponent(text);
  return `https://wa.me/${whatsappDigits}?text=${msg}`;
}
