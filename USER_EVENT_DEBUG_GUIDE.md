# User Event Table Debug Guide

## Issue Summary
No data is being recorded to the `user_events` table despite the table existing in Supabase.

## Root Causes (in order of likelihood)

### 1. **Edge Function NOT Deployed** ❌ MOST LIKELY
The `track-event` edge function must be explicitly deployed to Supabase. Just having the code in `/supabase/functions/track-event/` is not enough.

**Fix:**
```bash
cd /vercel/share/v0-project
supabase functions deploy track-event
```

Then check the function is deployed:
```bash
supabase functions list
```

You should see `track-event` in the list with status "active".

---

### 2. **Environment Variables Missing**
The client app needs these variables set:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon public key

**Check in browser console:**
Open DevTools → Console and look for these errors:
```
[v0] VITE_SUPABASE_URL is not set!
[v0] VITE_SUPABASE_ANON_KEY is not set!
```

**Fix:**
Create `/packages/client/.env` with:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

### 3. **CORS Issues**
The edge function has CORS headers configured to allow `*` origin, but the request might still be blocked.

**Check in browser:**
1. Open DevTools → Network tab
2. Look for request to `https://your-project.supabase.co/functions/v1/track-event`
3. If it shows error status (4xx, 5xx), check the response body for details

**Debug logs to look for:**
```
[v0] Analytics sending event to: https://your-project.supabase.co/functions/v1/track-event
[v0] Analytics response status: 200  ✅ (success)
[v0] Analytics response status: 403  ❌ (permission denied)
[v0] Analytics response status: 500  ❌ (server error)
```

---

### 4. **RLS Policy Issues**
The table has Row Level Security (RLS) enabled. Inserts might be blocked if RLS policies are misconfigured.

**Check in Supabase Dashboard:**
1. Go to Authentication → Policies
2. Find `user_events` table
3. Verify these policies exist:
   - "Allow insert user events" - allows anyone to insert
   - "Service role can insert events" - allows service role

**Current Policy (Updated):**
```sql
CREATE POLICY "Allow insert user events" ON user_events
  FOR INSERT WITH CHECK (true);
```

---

### 5. **Edge Function Environment Variables**
The edge function needs Supabase credentials.

**Check in Supabase Dashboard:**
1. Go to Edge Functions → track-event
2. Click "Settings"
3. Verify these environment variables are set:
   - `SUPABASE_URL` - same as client's URL
   - `SUPABASE_SERVICE_ROLE_KEY` - the service role key (secret!)

---

## Step-by-Step Debugging

### Step 1: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for `[v0]` messages - they show the full debugging flow
4. **Report any error messages you see**

### Step 2: Check Network Requests
1. Open DevTools → Network tab
2. Filter by: `/track-event`
3. Do some action on the page (click, scroll, navigate)
4. You should see a POST request to `/functions/v1/track-event`
5. Check if response is 200 (success) or error (4xx, 5xx)

### Step 3: Verify Edge Function is Deployed
```bash
supabase functions list
# You should see track-event in the output
```

### Step 4: Check Database
In Supabase SQL Editor:
```sql
SELECT COUNT(*) FROM user_events;  -- Should show > 0 if events are being recorded
SELECT * FROM user_events LIMIT 5;  -- See recent events
```

### Step 5: Test Edge Function Directly
In Supabase SQL Editor or via curl:
```bash
curl -X POST "https://your-project.supabase.co/functions/v1/track-event" \
  -H "Authorization: Bearer your-anon-key" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test_session_123",
    "event_name": "test_event",
    "page_path": "/",
    "metadata": {"test": true},
    "user_agent": "curl"
  }'
```

Expected response: `{"success":true}`

---

## Common Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `404 Not Found` | Edge function not deployed | Run `supabase functions deploy track-event` |
| `403 Forbidden` | RLS policy blocking inserts | Check policies are correct in Supabase |
| `400 Bad Request` | Missing required fields | Check event data includes `session_id`, `event_name`, `page_path` |
| `500 Internal Server Error` | Server error in function | Check Supabase function logs |
| `VITE_SUPABASE_URL is not set` | Env var missing | Create `.env` file with correct URL |
| `CORS error` | Origin not allowed | Edge function has `Access-Control-Allow-Origin: *` |

---

## What Should Happen

1. **User action** (scroll, click, navigate) → 
2. **`analytics.trackEvent()` called** → 
3. **Event sent to edge function** (`POST /functions/v1/track-event`) → 
4. **Edge function validates data** → 
5. **Supabase inserts into `user_events` table** → 
6. **Event appears in database**

If any step fails, check the corresponding section above.

---

## Report Output

When debugging, please provide:
1. What do you see in the **browser console** (search for `[v0]`)
2. What shows in the **Network tab** for `/track-event` requests
3. What does `SELECT COUNT(*) FROM user_events;` return
4. What does `supabase functions list` show
