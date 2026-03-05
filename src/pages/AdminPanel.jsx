import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { uploadToCloudinary } from "../api/cloudinary.js";
import { addGalleryItem, fetchGallery, deleteGalleryItem } from "../api/gallery.js";

const CITIES = ["Coimbatore", "Madurai", "Ramanathapuram", "Paramakudi"];

export default function AdminPanel() {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [city, setCity] = useState(CITIES[0]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    try {
      setErr("");
      const data = await fetchGallery();
      setItems(data);
    } catch (e) {
      setErr(e.message || "Failed to load gallery");
    }
  }

  useEffect(() => {
    load();
  }, []);

  function logout() {
    localStorage.removeItem("sd_admin");
    nav("/");
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return alert("Choose a photo first");

    setLoading(true);
    setErr("");
    try {
      const imageUrl = await uploadToCloudinary(file);

      await addGalleryItem({
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        title: title.trim(),
        city,
        imageUrl,
        createdAt: new Date().toISOString()
      });

      setTitle("");
      setCity(CITIES[0]);
      setFile(null);

      await load();
      alert("Uploaded ✅ Gallery updated!");
    } catch (e2) {
      setErr(e2.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, imageUrl) {
    const ok = confirm("Delete this photo from gallery?");
    if (!ok) return;

    setItems((prev) => prev.filter((it) => (id ? it.id !== id : it.imageUrl !== imageUrl)));

    setLoading(true);
    setErr("");
    try {
      if (!id) throw new Error("Missing id for this item. Please re-upload to generate id.");
      await deleteGalleryItem(id);
      await load();
      alert("Deleted ✅");
    } catch (e) {
      setErr(e.message || "Delete failed");
      await load();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="adminPage">
      <div className="container">
        <div className="adminHeader">
          <div>
            <div className="h2">Admin Panel</div>
            <div className="sub">Upload / delete photos for the gallery.</div>
          </div>
          <div className="adminActions">
            <Link className="btn ghost" to="/">View site</Link>
            <button className="btn" onClick={logout} type="button">Logout</button>
          </div>
        </div>

        <div className="adminGrid">
          <div className="panel">
            <div className="panelTitle">Upload new photo</div>
            <form onSubmit={handleUpload} className="form">
              <label>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Bridal Makeup • HD look" />

              <label>City</label>
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>

              <label>Choose photo</label>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />

              {err ? <div className="alert">⚠️ {err}</div> : null}

              <button className="btn wide" disabled={loading} type="submit">
                {loading ? "Uploading..." : "Upload"}
              </button>

              <div className="tiny" style={{ marginTop: 10 }}>
                If upload fails, check Cloudinary + Sheets env + Apps Script access.
              </div>
            </form>
          </div>

          <div className="panel">
            <div className="panelTitle">Latest photos</div>
            <div className="tiny" style={{ marginBottom: 10 }}>
              Showing {items.length} items
            </div>

            <div className="adminList">
              {items.slice(0, 24).map((x) => (
                <div className="adminItem" key={x.id || x.imageUrl}>
                  <img className="thumb" src={x.imageUrl} alt={x.title || "Photo"} />
                  <div className="adminInfo">
                    <div className="adminItemTitle">{x.title || "Untitled"}</div>
                    <div className="tiny">{x.city || ""} • {String(x.createdAt || "").slice(0, 10)}</div>
                  </div>

                  <button className="btn ghost" type="button" disabled={loading} onClick={() => handleDelete(x.id, x.imageUrl)}>
                    Delete
                  </button>
                </div>
              ))}

              {!items.length ? <div className="tiny">No photos yet. Upload the first one ✅</div> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
