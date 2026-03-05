import { waLink } from "../utils/links.js";
import { BRAND } from "../data.js";
import WhatsAppIcon from "./WhatsAppIcon.jsx";

export default function FloatingWA() {
  const href = waLink(BRAND.whatsappDigits, `Hi ${BRAND.name}! I want to book a service.`);
  return (
    <a className="fab" href={href} target="_blank" rel="noreferrer" aria-label="WhatsApp booking">
      <WhatsAppIcon size={22} />
    </a>
  );
}
