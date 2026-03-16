-- Create table for Gudi Padwa lead capture
CREATE TABLE IF NOT EXISTS gudi_padwa_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  property_type TEXT NOT NULL,
  source_page TEXT NOT NULL DEFAULT '/design-studio',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add constraints for data quality
  CONSTRAINT valid_phone CHECK (phone ~ '^[6-9]\d{9}$'),
  CONSTRAINT valid_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_property_type CHECK (property_type IN ('1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Villa'))
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_gudi_padwa_leads_created_at ON gudi_padwa_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gudi_padwa_leads_source_page ON gudi_padwa_leads(source_page);

-- Add Row Level Security (RLS) policies
ALTER TABLE gudi_padwa_leads ENABLE ROW LEVEL SECURITY;

-- Policy to allow inserts (anyone can submit the form)
CREATE POLICY "Allow insert operations" ON gudi_padwa_leads
  FOR INSERT WITH CHECK (true);

-- Policy to allow select operations (if you want to read the data)
CREATE POLICY "Allow select operations" ON gudi_padwa_leads
  FOR SELECT USING (true);

-- Optional: Add comments for documentation
COMMENT ON TABLE gudi_padwa_leads IS 'Leads captured from Gudi Padwa special offer campaign';
COMMENT ON COLUMN gudi_padwa_leads.name IS 'Full name of the customer';
COMMENT ON COLUMN gudi_padwa_leads.phone IS '10-digit Indian phone number';
COMMENT ON COLUMN gudi_padwa_leads.email IS 'Email address of the customer';
COMMENT ON COLUMN gudi_padwa_leads.property_type IS 'Type of property (1 BHK, 2 BHK, 3 BHK, 4 BHK, Villa)';
COMMENT ON COLUMN gudi_padwa_leads.source_page IS 'Page where the lead was captured';
COMMENT ON COLUMN gudi_padwa_leads.created_at IS 'Timestamp when the lead was captured';
