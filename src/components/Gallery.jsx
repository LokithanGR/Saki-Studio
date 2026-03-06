import { useEffect, useMemo, useRef, useState } from "react";
import { fetchGallery } from "../api/gallery.js";

const STEP = 10;

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
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
    setActiveIndex(null);

    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
  }, [city]);

  const canShowMore = visibleCount < filtered.length;
  const activeItem = activeIndex !== null ? visibleItems[activeIndex] : null;

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
    }, 120);
  };

  const openImage = (index) => {
    setActiveIndex(index);
  };

  const closeModal = () => {
    setActiveIndex(null);
  };

  const showPrevImage = (e) => {
    e?.stopPropagation?.();
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev === 0 ? visibleItems.length - 1 : prev - 1));
  };

  const showNextImage = (e) => {
    e?.stopPropagation?.();
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev === visibleItems.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeIndex === null) return;

      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") showPrevImage(e);
      if (e.key === "ArrowRight") showNextImage(e);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, visibleItems.length]);

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
          className="sliderBtn sliderBtnOuter left"
          onClick={slideLeft}
          aria-label="Scroll left"
        >
          ‹
        </button>

        <div className="sliderRow" ref={sliderRef}>
          {visibleItems.map((x, index) => (
            <button
              type="button"
              key={x.id || x.imageUrl || index}
              className="slideCard"
              onClick={() => openImage(index)}
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
          className="sliderBtn sliderBtnOuter right"
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

      {activeItem ? (
        <div className="modal" onClick={closeModal} role="presentation">
          <div
            className="modalCard"
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <div className="modalImageWrap">
              <button
                type="button"
                className="modalNav modalNavLeft"
                onClick={showPrevImage}
                aria-label="Previous image"
              >
                ‹
              </button>

              <img src={activeItem.imageUrl} alt={activeItem.title || "Preview"} />

              <button
                type="button"
                className="modalNav modalNavRight"
                onClick={showNextImage}
                aria-label="Next image"
              >
                ›
              </button>
            </div>

            <div className="modalBar">
              <div>
                <div className="modalTitle">{activeItem.title || "Look"}</div>
                <div className="tiny">
                  {activeItem.city ? `${activeItem.city} • ` : ""}
                  {String(activeItem.createdAt || "").slice(0, 10)}
                </div>
              </div>

              <button
                className="btn ghost"
                type="button"
                onClick={closeModal}
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