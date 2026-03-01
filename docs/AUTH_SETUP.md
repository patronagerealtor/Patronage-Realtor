# Authentication setup (Google + Data Entry access)

The app uses **Supabase Auth** with **Google OAuth**. Only signed-in users can open Data Entry, and you can restrict access to specific emails.

---

## 1. Environment variables (already in `.env`)

- **`VITE_SUPABASE_2_URL`** and **`VITE_SUPABASE_2_ANON_KEY`** – Supabase project (used for auth and DB).
- **`VITE_APP_URL`** – Site URL for OAuth redirect (e.g. `http://localhost:5000` or your production URL).
- **`VITE_AFTER_SIGNIN_REDIRECT`** – Where to send users after sign-in (e.g. `/` or `/data-entry`).
- **`VITE_DATA_ENTRY_ALLOWED_EMAIL`** – Comma-separated emails that can access `/data-entry`. Leave empty to allow any signed-in user.

Example:

```env
VITE_APP_URL=http://localhost:5000
VITE_AFTER_SIGNIN_REDIRECT=/
VITE_DATA_ENTRY_ALLOWED_EMAIL=patronagerealtor@gmail.com,other@example.com
```

---

## 2. Supabase Dashboard

### 2.1 Google provider

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Go to **Authentication** → **Providers**.
3. Enable **Google**.
4. You need a **Google OAuth Client ID** and **Client Secret** (see step 3 below). Paste them into Supabase and save.

### 2.2 URL configuration

1. In the same project, go to **Authentication** → **URL Configuration**.
2. Set **Site URL** to your app URL (e.g. `http://localhost:5000` for dev or `https://yourdomain.com` for prod).
3. Add **Redirect URLs** (one per line), for example:
   - `http://localhost:5000/`
   - `http://localhost:5000/data-entry`
   - `https://yourdomain.com/`
   - `https://yourdomain.com/data-entry`  
   (Supabase will redirect here after Google sign-in; include all paths you use as post-login targets.)

---

## 3. Google Cloud Console (OAuth credentials)

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → your project (or create one).
2. **APIs & Services** → **Credentials** → **Create credentials** → **OAuth client ID**.
3. Application type: **Web application**.
4. **Authorized redirect URIs** – add:
   - `https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`  
   (Find your project ref in Supabase: Project Settings → General → Reference ID.)
5. Create the client and copy **Client ID** and **Client Secret** into Supabase (Authentication → Providers → Google).

---

## 4. How it works in the app

- **`/login`** – Login page with “Sign in with Google”. Uses Supabase `signInWithOAuth({ provider: 'google' })`.
- **`/data-entry`** – Wrapped in `ProtectedRoute`:
  - Not signed in → redirect to `/login?redirect=/data-entry`.
  - Signed in but email not in `VITE_DATA_ENTRY_ALLOWED_EMAIL` → redirect to `/?access_denied=1`.
  - Signed in and (email in list or list empty) → Data Entry page is shown.
- **Header** – Shows “Sign in” when logged out and “Dashboard” + “Log out” when logged in.

---

## 5. Multiple allowed emails

Set **`VITE_DATA_ENTRY_ALLOWED_EMAIL`** to a comma-separated list (no spaces, or spaces are trimmed):

```env
VITE_DATA_ENTRY_ALLOWED_EMAIL=admin@example.com,editor@example.com
```

Only these users will be able to open `/data-entry`; others get redirected to `/?access_denied=1`.
