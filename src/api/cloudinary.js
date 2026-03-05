export async function uploadToCloudinary(file) {
  const cloudName = import.meta.env.VITE_CLOUD_NAME;
  const preset = import.meta.env.VITE_UPLOAD_PRESET;

  if (!cloudName || !preset) {
    throw new Error("Missing VITE_CLOUD_NAME or VITE_UPLOAD_PRESET in .env");
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", preset);
  form.append("folder", "saki-dazzle/gallery");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form
  });

  const json = await res.json();
  if (!json.secure_url) {
    throw new Error(json?.error?.message || "Cloudinary upload failed");
  }
  return json.secure_url;
}
