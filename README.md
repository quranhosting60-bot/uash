# UASH

    npm install
    cp .env.example .env.local     # then fill in ADMIN_PASSWORD
    npm run dev                    # store: http://localhost:3000   admin: http://localhost:3000/admin

## Admin panel (add, edit, delete products with photo, price, description)
Open `/admin` and log in with your ADMIN_PASSWORD.
- Only someone who knows the password can open it. Without ADMIN_PASSWORD the panel is switched off.
- The login is checked on the server, the session cookie cannot be read by scripts (httpOnly) and expires after 7 days.
- After 5 wrong passwords the login is locked for 15 minutes. The page is hidden from Google.
- Use a long unique password and never share it. Change it in Vercel > Settings > Environment Variables (this logs everyone out).

## Go live on uash.store
1. Push to GitHub, import the repo on vercel.com.
2. In Vercel: Storage > Create > Blob, and connect it to this project (this adds BLOB_READ_WRITE_TOKEN).
3. Settings > Environment Variables: add ADMIN_PASSWORD (and ADMIN_SECRET). Optional: RESEND_API_KEY, ORDER_EMAIL_TO, ORDER_EMAIL_FROM.
4. Redeploy. Settings > Domains > add uash.store and set the DNS records shown at your registrar.

Products and photos added in the admin panel are saved in Vercel Blob, so they show on the live site immediately.
Without BLOB_READ_WRITE_TOKEN (local testing) they are saved in the `data` folder on your computer only.

## Other settings
- Delivery charges, free-delivery limit, WhatsApp number, categories: `lib/products.js`
- The first products in `lib/products.js` are only the starting catalog. After you save anything in the admin panel, the admin panel's list is used.
- Policy pages (/privacy, /terms, /returns, /shipping, /contact): `app/[slug]/page.jsx` (template text only)
