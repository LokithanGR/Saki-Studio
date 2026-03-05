export async function fetchGallery() {
  const res = await fetch(`/api/gallery?t=${Date.now()}`, { cache: "no-store" });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "Failed to fetch gallery");

  const data = Array.isArray(json.data) ? json.data : [];
  return data
    .filter((x) => x.imageUrl)
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

export async function addGalleryItem(item) {
  const res = await fetch("/api/gallery", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item)
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "Failed to add gallery item");
  return json;
}

export async function deleteGalleryItem(id) {
  const res = await fetch("/api/gallery", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "delete", id })
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "Delete failed");
  return json;
}
