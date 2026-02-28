# Enable Google sign-in (Supabase)

The error **"Unsupported provider: provider is not enabled"** means the Google provider is not enabled in your Supabase project. Follow these steps:

## 1. Enable Google in Supabase

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Go to **Authentication** → **Providers**.
3. Find **Google** and turn it **ON**.
4. You’ll need a **Client ID** and **Client Secret** from Google (step 2).

## 2. Create Google OAuth credentials

1. Open [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**.
2. Create or select an OAuth 2.0 **Client ID** (application type: **Web application**).
3. Under **Authorized JavaScript origins** add:
   - `http://localhost:5000` (or the port you use in dev)
   - Your production URL, e.g. `https://yourdomain.com`
4. Under **Authorized redirect URIs** add the **Supabase callback URL**:
   - In Supabase: **Authentication** → **Providers** → **Google** → copy the “Callback URL (for OAuth)”.
   - It looks like: `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - Paste that exact URL into Google’s **Authorized redirect URIs**.
5. Copy the **Client ID** and **Client Secret** from the Google credential.

## 3. Add credentials in Supabase

1. Back in Supabase: **Authentication** → **Providers** → **Google**.
2. Paste the **Client ID** and **Client Secret** from Google.
3. Save.

## 4. Configure redirect URLs in Supabase

1. In Supabase go to **Authentication** → **URL Configuration**.
2. **Site URL**: set to your app’s main URL (e.g. `http://localhost:5000` or `https://yourdomain.com`).
3. **Redirect URLs**: add the URLs where users should land after sign-in, e.g.:
   - `http://localhost:5000/dashboard**
   - `https://yourdomain.com/dashboard**`

(The `**` allows that path and anything under it.)

After saving, try “Sign in with Google” again.
