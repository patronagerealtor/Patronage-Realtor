# Analytics Setup Guide

## 🚀 Quick Start

### 1. Environment Variables
Add these to your `.env` file:
```bash
VITE_OPENAI_API_KEY=sk-your-openai-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CRON_SECRET=your-cron-secret
```

### 2. Deploy Edge Function
```bash
cd /Users/vedangm/Desktop/Patronage-Realtor
supabase functions deploy track-event
```

### 3. Test Analytics
1. Start your dev server: `npm run dev`
2. Open browser dev tools → Console
3. You should see: "Analytics initialized"
4. Navigate around the site
5. Check Supabase `user_events` table - you should see data!

### 4. Verify Tracking
- **Page Views**: Automatically tracked on page load
- **Scroll Depth**: Tracked at 25%, 50%, 75%, 90%
- **Clicks**: All button/link clicks tracked
- **Property Views**: When property dialog opens
- **Calculator Usage**: When using EMI calculators
- **WhatsApp Links**: Special tracking for `wa.me` links

### 5. Check Data Flow
```sql
-- Verify events are coming in
SELECT COUNT(*) as total_events, 
       COUNT(DISTINCT session_id) as unique_sessions
FROM user_events 
WHERE created_at >= NOW() - INTERVAL '1 hour';
```

## 🔧 Troubleshooting

### No Events in Database?
1. Check console for "Analytics initialized"
2. Check network tab for failed `/api/track-event` requests
3. Verify Edge Function is deployed: `supabase functions list`
4. Check environment variables are loaded

### Edge Function Issues?
1. Verify Supabase CLI is installed: `npm install -g supabase`
2. Check you're logged in: `supabase login`
3. Deploy with correct project: `supabase projects`

### Environment Variables Not Working?
1. Restart dev server after adding to `.env`
2. Check `import.meta.env.VITE_OPENAI_API_KEY` in console
3. Verify variable names match exactly

## 📊 Expected Results

Within 5 minutes of navigating the site, you should see:
- ✅ Multiple `page_view` events
- ✅ `scroll_depth` events at different percentages
- ✅ `button_click` events for interactions
- ✅ Session data in `user_events` table

Once you have events, the AI summarization will work every 15 minutes!
