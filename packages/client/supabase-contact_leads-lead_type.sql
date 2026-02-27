-- Add optional lead_type to contact_leads. Run in Supabase SQL Editor.
-- Existing rows get default 'site_visit'. New floor plan requests use 'floorplan_request'.

ALTER TABLE contact_leads
ADD COLUMN IF NOT EXISTS lead_type text DEFAULT 'site_visit';
