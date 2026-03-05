import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Section from "../components/Section.jsx";
import Gallery from "../components/Gallery.jsx";
import FloatingWA from "../components/FloatingWA.jsx";
import { BRAND, SERVICES } from "../data.js";
import { waLink } from "../utils/links.js";
import logo from "../assets/logo.png";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const bookLink = waLink(
    BRAND.whatsappDigits,
    `Hi ${BRAND.name}! I want to book. City: ____ Date: ____ Service: ____`
  );

  const goTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // close menu when resizing to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 720) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="page">
      <header className="topbar">
        <div className="container topbarRow">
          {/* ✅ LOGO + BRAND */}
          <div className="logo">
            <img
              src={logo}
              alt={`${BRAND.name} logo`}
              className="logoMarkImg"
              loading="eager"
            />
            <div>
              <div className="logoName">{BRAND.name}</div>
              <div className="logoTag">{BRAND.tagline}</div>
            </div>
          </div>

          {/* ✅ DESKTOP MENU */}
          <nav className="menu desktopMenu">
            <a href="#services">Services</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact</a>
          </nav>

          {/* ✅ ACTIONS */}
          <div className="actions">
            <a className="btn ghost" href={`tel:${BRAND.phoneDial}`}>
              Call
            </a>
            <a className="btn" href={bookLink} target="_blank" rel="noreferrer">
              Book Now
            </a>

            {/* ✅ MOBILE MENU BUTTON */}
            <button
              className="menuBtn"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              type="button"
            >
              ☰
            </button>
          </div>

          {/* ✅ MOBILE DROPDOWN */}
          {menuOpen && (
            <div className="mobileMenu" role="menu">
              <button type="button" onClick={() => goTo("services")}>
                Services
              </button>
              <button type="button" onClick={() => goTo("gallery")}>
                Gallery
              </button>
              <button type="button" onClick={() => goTo("contact")}>
                Contact
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ✅ HERO */}
      <section className="hero">
        <div className="container heroGrid">
          <div className="heroLeft">
            <div className="badge">✨ Premium finishing • Hygienic kit • Photo-ready</div>
            <h1 className="h1">Luxury makeup for weddings & special events.</h1>
            <p className="lead">
              Based in <b>{BRAND.baseCity}</b> • Services in{" "}
              <b>{BRAND.cities.join(", ")}</b>. Bridal, party makeup, hair styling & skincare —
              with calm, professional service.
            </p>

            <div className="ctaRow">
              <a className="btn" href={bookLink} target="_blank" rel="noreferrer">
                WhatsApp Booking
              </a>
              <a className="btn ghost" href="#gallery">
                View Gallery
              </a>
            </div>

            <div className="highlights">
              <div className="hl">
                <div className="hlN">4+</div>
                <div className="hlT">Cities</div>
              </div>
              <div className="hl">
                <div className="hlN">HD</div>
                <div className="hlT">Finish</div>
              </div>
              <div className="hl">
                <div className="hlN">On-time</div>
                <div className="hlT">Service</div>
              </div>
            </div>
          </div>

          <div className="heroRight">
            <div className="heroCard">
              <div className="heroCardTop">
                <div className="heroCardTitle">Quick Booking</div>
              </div>

              <div className="miniGrid">
                <div className="mini">
                  <div className="miniH">📍 Locations</div>
                  <div className="miniP">{BRAND.cities.join(" • ")}</div>
                </div>
                <div className="mini">
                  <div className="miniH">⏰ Timings</div>
                  <div className="miniP">By appointment • Flexible slots</div>
                </div>
                <div className="mini">
                  <div className="miniH">💄 Products</div>
                  <div className="miniP">Premium kit • Clean tools</div>
                </div>
                <div className="mini">
                  <div className="miniH">✅ Style</div>
                  <div className="miniP">Soft glam to bold glam</div>
                </div>
              </div>

              <a className="btn wide" href={bookLink} target="_blank" rel="noreferrer">
                Book on WhatsApp
              </a>

              <div className="divider" />
            </div>

            <div className="heroArt" aria-hidden="true">
              <div className="blob b1" />
              <div className="blob b2" />
              <div className="spark s1" />
              <div className="spark s2" />
              <div className="spark s3" />
            </div>
          </div>
        </div>
      </section>

      {/* ✅ MAIN */}
      <main className="container">
        <Section
          id="services"
          title="Services"
          subtitle="Bridal to party, hair to skincare — all in one place."
        >
          <div className="cards">
            {SERVICES.map((s) => (
              <div className="card" key={s.title}>
                <div className="cardTitle">{s.title}</div>
                <div className="cardDesc">{s.desc}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="gallery" title="Gallery" subtitle="Latest looks.">
          <Gallery />
        </Section>

        <Section
          id="contact"
          title="Contact"
          subtitle="Call or WhatsApp to book. Share city + date + service."
        >
          <div className="contactGrid">
            <div className="contactCard">
              <div className="row">
                <div className="k">📞 Phone</div>
                <a className="v" href={`tel:${BRAND.phoneDial}`}>
                  {BRAND.phoneDisplay}
                </a>
              </div>
              <div className="row">
                <div className="k">🟢 WhatsApp</div>
                <a className="v" href={bookLink} target="_blank" rel="noreferrer">
                  Chat & Book
                </a>
              </div>
              <div className="row">
                <div className="k">📧 Email</div>
                <a className="v" href={`mailto:${BRAND.email}`}>
                  {BRAND.email}
                </a>
              </div>
              <div className="row">
                <div className="k">📷 Instagram</div>
                <a className="v" href={BRAND.instagram} target="_blank" rel="noreferrer">
                  Open profile
                </a>
              </div>
              <div className="note">
                Serving: <b>{BRAND.cities.join(", ")}</b>
              </div>
            </div>

            <div className="contactCard">
              <div className="cardTitle">Quick message template</div>
              <div className="template">
                Hi {BRAND.name}!<br />
                City: ____<br />
                Date: ____<br />
                Service: ____<br />
                Time: ____<br />
              </div>
              <a className="btn wide" href={bookLink} target="_blank" rel="noreferrer">
                Send on WhatsApp
              </a>
            </div>
          </div>
        </Section>

        <footer className="footer">
          <div className="tiny">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
            <h5>Developed by Loki...!</h5>
          </div>
          <div className="tiny">
            <Link className="adminLink" to="/admin">
              Login as admin?
            </Link>
          </div>
        </footer>
      </main>

      <FloatingWA />
    </div>
  );
}