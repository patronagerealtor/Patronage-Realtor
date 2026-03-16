-- Analytics Dashboard Queries

-- High Intent Users (Intent Score > 70)
SELECT 
  session_id,
  intent_score,
  recommended_action,
  created_at,
  summary->>'user_intent' as user_intent,
  summary->>'engagement_level' as engagement_level
FROM session_summaries 
WHERE intent_score > 70 
ORDER BY created_at DESC 
LIMIT 50;

-- Session Summary Stats
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(*) as session_count,
  AVG(intent_score) as avg_intent_score,
  COUNT(CASE WHEN intent_score > 70 THEN 1 END) as high_intent_sessions
FROM session_summaries 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', created_at)
ORDER BY hour DESC;

-- Top Pages by Engagement
SELECT 
  page_path,
  COUNT(*) as event_count,
  COUNT(DISTINCT session_id) as unique_sessions,
  AVG(CASE WHEN event_name = 'scroll_depth' THEN (metadata->>'percent')::numeric END) as avg_scroll_depth
FROM user_events 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY page_path
ORDER BY unique_sessions DESC
LIMIT 20;

-- Property View Analysis
SELECT 
  metadata->>'property_id' as property_id,
  metadata->>'property_type' as property_type,
  COUNT(*) as view_count,
  COUNT(DISTINCT session_id) as unique_viewers,
  AVG(CASE WHEN event_name = 'property_view' THEN 1::numeric END) as engagement_rate
FROM user_events 
WHERE event_name = 'property_view' 
  AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY metadata->>'property_id', metadata->>'property_type'
ORDER BY view_count DESC
LIMIT 50;

-- WhatsApp Click Performance
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as whatsapp_clicks,
  COUNT(DISTINCT session_id) as unique_sessions_with_clicks,
  ROUND(COUNT(*) * 100.0 / COUNT(DISTINCT session_id), 2) as clicks_per_session
FROM user_events 
WHERE metadata->>'isWhatsApp' = 'true'
  AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Calculator Usage Tracking
SELECT 
  metadata->>'calculator_type' as calculator_type,
  metadata->>'type' as input_type,
  COUNT(*) as usage_count,
  COUNT(DISTINCT session_id) as unique_users
FROM user_events 
WHERE event_name = 'calculator_input'
  AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY metadata->>'calculator_type', metadata->>'type'
ORDER BY usage_count DESC;

-- Form Submission Funnel
SELECT 
  page_path,
  COUNT(CASE WHEN event_name = 'page_view' THEN 1 END) as page_views,
  COUNT(CASE WHEN event_name = 'button_click' THEN 1 END) as button_clicks,
  COUNT(CASE WHEN event_name = 'form_submit' THEN 1 END) as form_submissions,
  COUNT(DISTINCT session_id) as unique_sessions,
  ROUND(
    COUNT(CASE WHEN event_name = 'form_submit' THEN 1 END)::numeric * 100.0 / 
    COUNT(DISTINCT session_id), 2
  ) as conversion_rate
FROM user_events 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY page_path
ORDER BY unique_sessions DESC;
