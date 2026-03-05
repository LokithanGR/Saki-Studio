import { useEffect, useMemo, useState } from "react";
import { fetchGallery } from "../api/gallery.js";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [city, setCity] = useState("All");

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
    return () => (mounted = false);
  }, []);

  const cities = useMemo(() => {
    const s = new Set(items.map((x) => x.city).filter(Boolean));
    return ["All", ...Array.from(s)];
  }, [items]);

  const filtered = useMemo(() => {
    if (city === "All") return items;
    return items.filter((x) => x.city === city);
  }, [items, city]);

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
        <div className="tiny">{loading ? "Loading..." : `${filtered.length} photos`}</div>
      </div>

      {err ? <div className="alert">⚠️ {err}</div> : null}

      <div className="gridPhotos">
        {filtered.map((x) => (
          <button
            type="button"
            key={x.id || x.imageUrl}
            className="photo"
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

      {active ? (
        <div className="modal" onClick={() => setActive(null)} role="presentation">
          <div className="modalCard" onClick={(e) => e.stopPropagation()} role="presentation">
            <img src={active.imageUrl} alt={active.title || "Preview"} />
            <div className="modalBar">
              <div>
                <div className="modalTitle">{active.title || "Look"}</div>
                <div className="tiny">
                  {active.city ? `${active.city} • ` : ""}
                  {String(active.createdAt || "").slice(0, 10)}
                </div>
              </div>
              <button className="btn ghost" type="button" onClick={() => setActive(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
