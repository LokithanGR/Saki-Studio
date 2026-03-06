import { useEffect, useMemo, useRef, useState } from "react";
import { fetchGallery } from "../api/gallery.js";

const STEP = 10;

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [city, setCity] = useState("All");
  const [visibleCount, setVisibleCount] = useState(STEP);

  const sliderRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const data = await fetchGallery();
        if (mounted) setItems(data);
      } catch (e) {
        if (mounted) setErr(e.message || "Failed to load gallery");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const cities = useMemo(() => {
    const s = new Set(items.map((x) => x.city).filter(Boolean));
    return ["All", ...Array.from(s)];
  }, [items]);

  const filtered = useMemo(() => {
    if (city === "All") return items;
    return items.filter((x) => x.city === city);
  }, [items, city]);

  const visibleItems = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  useEffect(() => {
    setVisibleCount(STEP);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
  }, [city]);

  const canShowMore = visibleCount < filtered.length;

  const slideLeft = () => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: -sliderRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const slideRight = () => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: sliderRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + STEP);

    setTimeout(() => {
      if (!sliderRef.current) return;

      sliderRef.current.scrollBy({
        left: sliderRef.current.clientWidth,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <div>
      <div className="galleryTop">
        <div className="chips">
          {cities.slice(0, 10).map((c) => (
            <button
              type="button"
              key={c}
              className={"chip " + (c === city ? "chipActive" : "")}
              onClick={() => setCity(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="tiny">
          {loading ? "Loading..." : `${filtered.length} photos`}
        </div>
      </div>

      {err ? <div className="alert">⚠️ {err}</div> : null}

      <div className="gallerySliderWrap">
        <button
          type="button"
          className="sliderBtn left"
          onClick={slideLeft}
          aria-label="Scroll left"
        >
          ‹
        </button>

        <div className="sliderRow" ref={sliderRef}>
          {visibleItems.map((x) => (
            <button
              type="button"
              key={x.id || x.imageUrl}
              className="slideCard"
              onClick={() => setActive(x)}
              title={x.title || "View"}
            >
              <img src={x.imageUrl} alt={x.title || "Gallery"} loading="lazy" />
              <div className="photoMeta">
                <div className="photoTitle">{x.title || "Look"}</div>
                <div className="photoSub">{x.city || ""}</div>
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="sliderBtn right"
          onClick={slideRight}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>

      {canShowMore ? (
        <div className="showMoreWrap">
          <button type="button" className="btn" onClick={handleShowMore}>
            Show More
          </button>
        </div>
      ) : null}

      {active ? (
        <div
          className="modal"
          onClick={() => setActive(null)}
          role="presentation"
        >
          <div
            className="modalCard"
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <img src={active.imageUrl} alt={active.title || "Preview"} />
            <div className="modalBar">
              <div>
                <div className="modalTitle">{active.title || "Look"}</div>
                <div className="tiny">
                  {active.city ? `${active.city} • ` : ""}
                  {String(active.createdAt || "").slice(0, 10)}
                </div>
              </div>
              <button
                className="btn ghost"
                type="button"
                onClick={() => setActive(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}