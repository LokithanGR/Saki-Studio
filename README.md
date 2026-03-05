# Saki Dazzle Beauty Studio (Professional React Website)

✅ Professional UI (mobile responsive)  
✅ Admin Login + Admin Panel (upload + delete)  
✅ Cloudinary (image hosting) + Google Sheets (gallery DB)  
✅ CORS safe via `/api/gallery` proxy  
✅ Admin route never breaks because it uses **HashRouter**

---

## Run locally
```bash
npm install
cp .env.example .env
npm run dev
```

### Routes
- Home: `/#/`
- Admin login: `/#/admin`
- Admin panel: `/#/admin/panel`

---

## Deploy (Vercel recommended)
Set env vars in Vercel:
- `VITE_CLOUD_NAME`
- `VITE_UPLOAD_PRESET`
- `SHEETS_API_URL` ✅

---
